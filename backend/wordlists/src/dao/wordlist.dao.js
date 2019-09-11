const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Wordlist = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, index: true },
  description: String,
  dateCreated: { type: Date, default: Date.now },
  language: String,
  name: String,
  words: [{ name: String, images: [{ url: String, description: String }] }]
});

Wordlist.static("addWord", function(wordlistId, newWordObject, user) {
  return this.findOneAndUpdate(
    { _id: wordlistId, owner: user._id },
    { $push: { words: newWordObject } },
    { lean: true, new: true, select: "words" }
  );
});

Wordlist.static("patchWord", function(idWordlist, idWord, updateObject, user) {
  const updateCommand = Object.keys(updateObject).reduce((command, property) => {
    command[`words.$.${property}`] = updateObject[property];
    return command;
  }, {});

  return this.updateOne({ _id: idWordlist, owner: user._id, "words._id": idWord }, { $set: updateCommand });
});

Wordlist.static("deleteWord", function(idWordlist, idWord, user) {
  return this.updateOne({ _id: idWordlist, owner: user._id }, { $pull: { words: { _id: idWord } } });
});

Wordlist.static("getWord", function(idWordlist, idWord, user) {
  return this.findOne({ _id: idWordlist, owner: user._id, "words._id": idWord });
});

Wordlist.static("getAllWords", function(idWordlist, user) {
    return this.findOne({ _id: idWordlist, owner: user._id });
  });

module.exports = mongoose.model("Wordlist", Wordlist);
