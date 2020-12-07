const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    githubId: String,
    accessToken: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;