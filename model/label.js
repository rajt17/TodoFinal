const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    task:[{id:mongoose.Schema.Types.ObjectId}]
});

const Label = mongoose.model('labelLog2', userSchema);

module.exports = Label;
