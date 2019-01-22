const Task = require('../model/task');
const Label = require('../model/label');

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
module.exports = function (newTask, labels,cb) {
    if (labels instanceof Array) {
        newTask.label = newTask.label.concat(labels).unique();

    } else {
        console.log(newTask.label.includes(labels));
        if(newTask.label.includes(labels)==false)     
             newTask.label.push(labels);
    }
    newTask.save().then(task => {
        console.log(task);
        if (labels instanceof Array) {
            labels.forEach(element => {
                Label.findOne({ name: element }).then(label => {
                    label.task.push(newTask._id);
                    label.save();
                })
            });
        } else {
            Label.findOne({ name: labels }).then(label => {
                label.task.push(newTask._id);
                label.save();
            })
        }
        cb();
    });
}