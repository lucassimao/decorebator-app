const mongoose = require("mongoose");
const config = require("../config");
const WordlistDao = require("../dao/wordlist.dao");

/**
 * Returns user's wordlists
 *
 * @param {number} pageSize The amount of wordlists to be returned
 * @param {String} filter A search key to use as filter to the field name of the wordlists
 * @param {number} page As the data set is seen as a set of pages, this param represents the requested page
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to an array of wordlists
 */
const list = (
  { pageSize = config.defaultPageSize, page = 0, filter },
  user
) => {
  const skip = page > 0 ? page * pageSize : 0;
  const query = { owner: user._id };
  if (filter) {
    query.name = new RegExp(filter, "i");
  }
  return WordlistDao.find(query, null, {
    lean: true,
    limit: pageSize,
    skip,
    sort: { _id: -1 }
  });
};

/**
 * Returns public wordlists
 *
 * @param {number} pageSize The amount of wordlists to be returned
 * @param {String} filter A search key to use as filter to the field name of the wordlists
 * @param {number} page As the data set is seen as a set of pages, this param represents the requested page
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to an array of wordlists
 */
const listPublic = (
  { pageSize = config.defaultPageSize, page = 0, filter },
  user
) => {
  const skip = page > 0 ? page * pageSize : 0;
  const query = { owner: { $ne: user._id }, isPrivate: false };
  if (filter) {
    query.name = new RegExp(filter, "i");
  }
  return WordlistDao.find(query, null, {
    limit: pageSize,
    lean: true,
    skip,
    sort: { _id: -1 }
  });
};

/**
 * Register a new wordlist
 *
 * @param {object} wordlist the wordlist to be persisted
 * @param {object} user The authenticated user, owner of the new wordlist
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to the persisted object
 */
const save = async (wordlist, user) => {
  let { words } = wordlist;
  const userSentValidArrayOfWords =
    words && Array.isArray(words) && words.length > 0;
  const logger = config.logger;

  if (userSentValidArrayOfWords) {
    for (const w of words) {
      w.name = w.name.toLowerCase();
    }
  }

  if ("onlyNewWords" in wordlist) {
    if (wordlist.onlyNewWords && userSentValidArrayOfWords) {
      logger.debug(
        `Registering new wordlist for user ${user._id} with ${words.length} words`
      );

      // extracting all user's wordlist terms
      const existingWords = await WordlistDao.aggregate([
        { $match: { owner: user._id } },
        { $project: { words: 1, _id: 0 } },
        { $unwind: "$words" },
        { $replaceWith: "$words" },
        { $group: { _id: "$name" } },
        { $sort: { _id: 1 } }
      ]);
      const existingNames = existingWords.map(w => w._id);
      logger.debug(
        `User ${user._id} has ${existingNames.length} words already`
      );

      words = words.filter(
        ({ name }) =>
          !__binarySearch(existingNames, name, 0, existingNames.length)
      );
      logger.debug(
        `Filtered wordlist for user ${user._id} now with ${words.length} words`
      );
    }
    delete wordlist.onlyNewWords;
  }

  return WordlistDao.create({ ...wordlist, owner: user._id, words });
};

/**
 * Search the database for a wordlist with an _id, returning all fields but words
 *
 * @param {string|mongoose.Types.ObjectId} id the wordlist id
 * @param {object} user The authenticated user, owner of the wordlist
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to the persisted object, if found
 */
const get = async (id, user) => {
  var ObjectId = mongoose.Types.ObjectId;

  const query = { _id: id instanceof ObjectId ? id : ObjectId(id) };
  if (user) {
    query.owner = user._id instanceof ObjectId ? user._id : ObjectId(user._id);
  }

  const result = await WordlistDao.aggregate([
    { $match: query },
    { $addFields: { wordsCount: { $size: "$words" } } },
    { $project: { words: 0 } },
    { $limit: 1 }
  ]);
  if (Array.isArray(result) && result.length === 1) {
    return result[0];
  } else {
    return null;
  }
};

/**
 * Search the database for a wordlist with an _id, returning all fields
 *
 * @param {string|mongoose.Types.ObjectId} id the wordlist id
 * @param {object} user The authenticated user, owner of the wordlist
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to the persisted object, if found
 */
const getWithWords = (id, user) => {
  const query = { _id: id };
  if (user) {
    query.owner = user._id;
  }
  return WordlistDao.findOne(query, null, { lean: true });
};

/**
 * Updates a existing wordlist
 *
 * @param {string|mongoose.Types.ObjectId} id The id of the object to be updated
 * @param {object} user The authenticated user, owner of the wordlist
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to an operation info object from MongoDB
 */
const update = (id, updateObj, user) => {
  return WordlistDao.updateOne({ _id: id, owner: user._id }, updateObj);
};

/**
 * removes an existing wordlist
 *
 * @param {string|mongoose.Types.ObjectId} id The id of the object to be updated
 * @param {object} user The authenticated user, owner of the wordlist
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to an operation info object from MongoDB
 */
const remove = (id, user) => {
  return WordlistDao.deleteOne({ _id: id, owner: user._id });
};

/**
 * Makes a binary search of element inside the array.
 *
 * Assumptions: - The array is already sorted
 *              - There's no undefined element on the array
 *
 * @param {Array<any>} array The array of elements
 * @param {any} element The element to be searched in the array
 * @returns {Boolean} indicating whether the element is in the array or not
 */
function __binarySearch(array, element, start, end, debug = false) {
  const middle = start + Math.floor((end - start) / 2);
  debug &&
    config.logger.debug(`start: ${start}, middle : ${middle}, end: ${end}`);

  if (start >= end) {
    return false;
  } else if (array[middle] < element) {
    return __binarySearch(array, element, middle + 1, end, debug);
  } else if (array[middle] > element) {
    return __binarySearch(array, element, start, middle, debug);
  } else {
    return array[middle] === element;
  }
}

const api = {
  list,
  listPublic,
  save,
  get,
  getWithWords,
  update,
  delete: remove
};

module.exports = api;
