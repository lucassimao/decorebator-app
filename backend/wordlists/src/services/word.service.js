const WordlistDao = require("../dao/wordlist.dao");

/**
 * Returns a single word from an user's wordlists
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {string|mongoose.Types.ObjectId} idWord the id of the word
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to a word object or null, if the word wasn't found
 */
const get = async (idWordlist, idWord, user) => {
  const result = await WordlistDao.getWord(idWordlist, idWord, user);

  if (result && result.words){
      return result.words[0]
  } else {
      return null;
  }
  
};

/**
 * Returns words from an user's wordlists. If the page argument is different from
 * null, paginates the response, otherwise, returns all words.
 *
 * @param {string|mongoose.Types.ObjectId} idWordlist the id of the wordlist
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 * @param {number} page The page number
 * @param {number} pageSize The size of the result to be returned 
 *
 * @returns {Promise} A promise, which resolves to all words of a wordlist object
 */
const getWords = (idWordlist, user, page, pageSize) => {
  return WordlistDao.getWords(idWordlist, user, page, pageSize);
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

module.exports = {
  get,
  getWords,
  addWord,
  patchWord,
  delete: deleteWord
};
