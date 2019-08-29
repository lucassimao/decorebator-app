const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  dateCreated: { type: Date, default: Date.now },
    email: String,
    encrypted_password: String
});

module.exports = mongoose.model('User', User);

