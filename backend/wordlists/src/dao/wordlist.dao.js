const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Wordlist = new Schema({
  owner: { type: [mongoose.Schema.Types.ObjectId], index: true },
  description: String,
  dateCreated: { type: Date, default: Date.now },
  language: String,
  name: String,
  words: [{ name: String, images: [{ url: String, description: String }] }]
});

module.exports = mongoose.model("Wordlist", Wordlist);
