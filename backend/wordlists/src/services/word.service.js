const WordlistDao = require("../dao/wordlist.dao");

/**
 * Returns a single word from an user's wordlists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {string|mongoose.Types.ObjectId} idWord the id of the word
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to a word object
 */
const get = (idWordlist, idWord, user) => {
  return WordlistDao.getWord(idWordlist, idWord, user);
};

/**
 * Returns all words from an user's wordlists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to all words of a wordlist object
 */
const getAll = (idWordlist, user) => {
  return WordlistDao.getAllWords(idWordlist, user);
};

/**
 * Inserts a new word in an user's wordlists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 * @param {object} newWordObject A word to be inserted
 *
 * @returns {Promise} A promise, which resolves to all words of a wordlist object
 */
const addWord = (idWordlist, newWordObject, user) => {
  return WordlistDao.addWord(idWordlist, newWordObject, user);
};

/**
 * Updates a existing word in an user's wordlists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {string|mongoose.Types.ObjectId} idWord the id of the word to be updated
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 * @param {object} updateObject A object with word properties to be updated
 *
 * @returns {Promise} A promise, which resolves to a response object from MongoDB reporting the operation status
 */
const patchWord = (idWordlist, idWord, updateObject, user) => {
  return WordlistDao.patchWord(idWordlist, idWord, updateObject, user);
};

/**
 * Deletes an existing word in an user's wordlists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {string|mongoose.Types.ObjectId} idWord the id of the word to be updated
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to a response object from MongoDB reporting the operation status
 */
const deleteWord = (idWordlist, idWord, user) => {
  return WordlistDao.deleteWord(idWordlist, idWord, user);
};

/**
 * checks if a word exists inside a wordlist with such _id exists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist
 * @param {string|mongoose.Types.ObjectId} idWord
 *
 * @returns {Promise} A promise, which resolves to a boolean value
 */
const exists = (idWordlist, idWord, user) => {
  return WordlistDao.exists({ _id: idWordlist, "words._id": idWord });
};

module.exports = {
  get,
  getAll,
  addWord,
  patchWord,
  delete: deleteWord,
  exists
};
