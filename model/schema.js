const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email:String,
    password:String,
    img:String,
    oldpic:[{name:String}],
    googleId: String,
    facebookId:String,
    githubId: String,
    Tasks:[{id:mongoose.Schema.Types.ObjectId}],
});

const User = mongoose.model('Log3', userSchema);

module.exports = User;
