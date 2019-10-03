const mongoose = require("mongoose");
const { logger } = require("../config");

const Schema = mongoose.Schema;

const Wordlist = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, index: true, required: true },
  description: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  language: { type: String, required: true },
  name: { type: String, required: true },
  words: [{ name: { type: String, required: true }, images: [{ url: { type: String, required: true }, description: String }] }]
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
  return this.findOne({ _id: idWordlist, owner: user._id, "words._id": idWord }, "words.$");
});

Wordlist.static("getAllWords", function(idWordlist, user) {
  return this.findOne({ _id: idWordlist, owner: user._id }, "words");
});

Wordlist.static("addImage", function(idWordlist, idWord, { url, description }, user) {
  return this.findOneAndUpdate(
    { _id: idWordlist, "words._id": idWord, owner: user._id },
    { $push: { "words.$.images": { url, description } } },
    { new: true, lean: true, select: "words.images words._id" }
  );
});

Wordlist.static("deleteImage", function(idWordlist, idWord, idImage, user) {
  return this.updateOne(
    { _id: idWordlist, "words._id": idWord, owner: user._id },
    { $pull: { "words.$.images": { _id: idImage } } }
  );
});

Wordlist.static("patchImage", function(idWordlist, idWord, idImage, updateObject, user) {
  const updateCommand = Object.keys(updateObject).reduce((command, property) => {
    command[`words.$[w].images.$[i].${property}`] = updateObject[property];
    return command;
  }, {});

  return this.updateOne(
    { _id: idWordlist, owner: user._id },
    { $set: updateCommand },
    { arrayFilters: [{ "w._id": idWord }, { "i._id": idImage }] }
  );
});

module.exports = mongoose.model("Wordlist", Wordlist);
