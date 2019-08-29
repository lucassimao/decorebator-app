const WordlistDao = require("../dao/wordlist.dao");
const config = require("../config");
const mongoose = require("mongoose");

const list = (user, { pageSize = config.defaultPageSize, page = 0 }) => {
  const skip = page > 0 ? (page - 1) * pageSize : 0;
  return WordlistDao.find({ user }, null, { limit: pageSize, skip }).exec();
};

const save = wordlist => {
  return WordlistDao.create(wordlist);
};

const get = id => {
  return WordlistDao.findOne({ _id: mongoose.Types.ObjectId(id) });
};

const update = (id, updateObj) => {
  return WordlistDao.updateOne({ _id: mongoose.Types.ObjectId(id) }, updateObj).exec();
};

const remove = id => {
  return WordlistDao.deleteOne({ _id: mongoose.Types.ObjectId(id) });
};

const deleteWord = async (idWordlist, idWord) => {
  await WordlistDao.updateOne({ _id: idWordlist }, { $unset: { [`words.${idWord}`]: 1 } });
  return WordlistDao.updateOne({ _id: idWordlist }, { $pull: { words: null } });
};

/**
 * Updates a wordlist, appending a new word to the array of words
 *
 * returns the updated object
 *
 * @param {string} id
 * @param {object} word
 */
const addWord = (id, word) => {
  return WordlistDao.findByIdAndUpdate(id, { $push: { words: word } }, { lean: true, new: true }).exec();
};

module.exports = {
  list,
  save,
  get,
  update,
  addWord,
  delete: remove,
  deleteWord
};
