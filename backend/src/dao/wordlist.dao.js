const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Wordlist = new Schema({
  description: String,
  dateCreated: { type: Date, default: Date.now },
  language: String,
  name: String,
  words: [{name:String}]
});

module.exports = mongoose.model('Wordlist', Wordlist);

