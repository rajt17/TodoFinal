const Task = require('../model/task');
const Label = require('../model/label');

module.exports = function (newTask, labels,cb) {
    if (labels instanceof Array) {
        newTask.label = newTask.label.concat(labels);

    } else {
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