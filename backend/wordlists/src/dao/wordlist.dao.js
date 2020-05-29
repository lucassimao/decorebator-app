const mongoose = require("mongoose");
const { logger } = require("../config");

const Schema = mongoose.Schema;

const Wordlist = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, index: true, required: true },
  isPrivate: { type: Boolean, default: true },
  description: { type: String, required: false },
  dateCreated: { type: Date, default: Date.now },
  language: { type: String, required: true },
  name: { type: String, required: true, index: true },
  avatarColor: { type: String },
  words: [
    {
      name: { type: String, required: true },
      images: [{ url: { type: String, required: true }, description: String }]
    }
  ],
  fileInfo: {extension: String, size: Number, extractionMs: Number, required: false }
});

Wordlist.static("addWord", function(wordlistId, newWordObject, user) {
  return this.findOneAndUpdate(
    { _id: wordlistId, owner: user._id },
    { $push: { words: newWordObject } },
    { lean: true, new: true, select: "words" }
  );
});

Wordlist.static("patchWord", function(idWordlist, idWord, updateObject, user) {
  const updateCommand = Object.keys(updateObject).reduce(
    (command, property) => {
      command[`words.$.${property}`] = updateObject[property];
      return command;
    },
    {}
  );

  return this.updateOne(
    { _id: idWordlist, owner: user._id, "words._id": idWord },
    { $set: updateCommand }
  );
});

Wordlist.static("deleteWord", function(idWordlist, idWord, user) {
  return this.updateOne(
    { _id: idWordlist, owner: user._id },
    { $pull: { words: { _id: idWord } } }
  );
});

Wordlist.static("getWord", function(idWordlist, idWord, user) {
  return this.findOne(
    { _id: idWordlist, owner: user._id, "words._id": idWord },
    "words.$",
    { lean: true }
  );
});

Wordlist.static("getWords", function(idWordlist, user, skip, limit) {
  let projection;

  if (isNaN(skip) || isNaN(limit)) {
    projection = { words: 1 };
    logger.warn(
      `Reading all words from wordlist ${idWordlist} user ${user._id} skip ${skip} limit ${limit}`
    );
  } else {
    projection = { words: { $slice: [skip, limit] }, "words.images": 0 };
    // turnning of the remaining wordlist properties
    Object.keys(Wordlist.paths)
      .filter(property => property != "words")
      .forEach(property => (projection[property] = 0));
  }

  return this.findOne({ _id: idWordlist, owner: user._id }, projection, {
    lean: true
  });
});

Wordlist.static("addImage", function(
  idWordlist,
  idWord,
  { url, description },
  user
) {
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

Wordlist.static("patchImage", function(
  idWordlist,
  idWord,
  idImage,
  { description },
  user
) {
  return this.updateOne(
    { _id: idWordlist, owner: user._id },
    { $set: { "words.$[w].images.$[i].description": description } },
    { arrayFilters: [{ "w._id": idWord }, { "i._id": idImage }] }
  );
});

module.exports = mongoose.model("Wordlist", Wordlist);
