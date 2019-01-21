const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    creationDate:{
        type:Date,
        defalut:Date.now()
    },
    targetDate:Date,
    finshedDate:Date,
    status:{
        type:String,
        default:'Initial'
    },
    priority:String,
    owner:String,
    label:String
});

const Task = mongoose.model('taskLog', userSchema);

module.exports = Task;
