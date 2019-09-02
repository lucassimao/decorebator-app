const config = require("decorebator-common").config;
const WordlistDao = require("../dao/wordlist.dao");

const list = (user, { pageSize = config.defaultPageSize, page = 0 }) => {
  const skip = page > 0 ? (page - 1) * pageSize : 0;
  return WordlistDao.find({ user }, null, { limit: pageSize, skip });
};

const save = wordlist => {
  return WordlistDao.create(wordlist);
};

const get = id => {
  return WordlistDao.findOne({ _id: id });
};

const update = (id, updateObj) => {
  return WordlistDao.updateOne({ _id: id }, updateObj);
};

const deleteAll = ()=>{
    return WordlistDao.deleteMany({});
}

const remove = id => {
  return WordlistDao.deleteOne({ _id: id });
};

const deleteWord = (idWordlist, idWord) => {
  return WordlistDao.updateOne({ _id: idWordlist }, { $pull: { words: { _id: idWord } } });
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
  return WordlistDao.findByIdAndUpdate(id, { $push: { words: word } }, { lean: true, new: true });
};

module.exports = {
  list,
  save,
  get,
  update,
  addWord,
  delete: remove,
  deleteAll,
  deleteWord
};