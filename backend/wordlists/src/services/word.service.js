const { WordRepository, config: { logger } } = require('@lucassimao/decorabator-common')

/**
 * Returns a single word from an user's wordlists
 *
 * @param {number} idWordlist the id of the wordlist
 * @param {number} idWord the id of the word
 * @param {object} user The authenticated user
 *
 * @returns {Promise} A promise, which resolves to a word object or null, if the word wasn't found
 */
const get = async (idWordlist, idWord, user) => {
  return WordRepository.getById(idWordlist, idWord, user.id)
};

const getWithImages = async (idWordlist, idWord, user) => {
  return WordRepository.getByIdWithImages(idWordlist, idWord, user.id)
};

/**
 * Returns words from an user's wordlists. If the page argument is different from
 * null, paginates the response, otherwise, returns all words.
 *
 * @param {number} idWordlist the id of the wordlist
 * @param {object} user The authenticated user
 * @param {number} user.id The user id
 * @param {number} skip The amount of items to skip from the start of the array of words
 * @param {number} limit The number of items to return
 *
 * @returns {Promise} A promise, which resolves to all words of a wordlist object
 */
const getWords = async (idWordlist, user, skip, limit) => {
  let paginationArgs
  if (Number.isInteger(skip) && Number.isInteger(limit)) {
    paginationArgs = { offset: skip, limit }
  } else {
    logger.warn(`Ignoring pagination args: idWordlist ${idWordlist} skip: ${skip} limit: ${limit}`)
  }

  return WordRepository.getWordsFromWordlist(idWordlist, user.id, paginationArgs)
};

/**
 * Inserts a new word in an user's wordlists
 *
 * @param {number} idWordlist the id of the wordlist
 * @param {object} user The authenticated user
 * @param {number} user.id The user id
 * @param {object} newWordObject A word to be inserted
 *
 * @returns {Promise} A promise, which resolves to the id of the new word
 */
const addWord = (idWordlist, newWordObject, user) => {
  return WordRepository.createWord(idWordlist, newWordObject.name, user.id)
};

/**
 * Updates a existing word in an user's wordlists
 *
 * @param {number} idWordlist the id of the wordlist
 * @param {number} idWord the id of the word to be updated
 * @param {object} user The authenticated user
 * @param {number} user.id The user id
 * @param {object} updateObject A object with word properties to be updated
 *
 * @returns {Promise} A promise, which resolves to true or false
 */
const patchWord = (idWordlist, idWord, updateObject, user) => {
  return WordRepository.updateWord(updateObject.name, idWordlist, idWord, user.id)
};

/**
 * Deletes an existing word in an user's wordlists
 *
 * @param {number} idWordlist the id of the wordlist
 * @param {number} idWord the id of the word to be updated
 * @param {object} user The authenticated user
 * @param {number} user.id The user id
 *
 * @returns {Promise} A promise, which resolves to true or false
 */
const deleteWord = (idWordlist, idWord, user) => {
  return WordRepository.deleteWord(idWordlist, idWord, user.id)
};

module.exports = {
  get,
  getWords,
  addWord,
  patchWord,
  delete: deleteWord,
  getWithImages
};
