const config = require("../config");
const WordlistDao = require("../dao/wordlist.dao");

/**
 * Returns user's wordlists
 *
 * @param {number} pageSize The amount of wordlists to be returned
 * @param {number} page As the data set is seen as a set of pages, this param represents the requested page
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to an array of wordlists
 */
const list = ({ pageSize = config.defaultPageSize, page = 0 }, user) => {
  const skip = page > 0 ? page * pageSize : 0;
  return WordlistDao.find({ owner: user._id }, null, { limit: pageSize, skip, sort: { _id: -1 } });
};

/**
 * Returns public wordlists
 *
 * @param {number} pageSize The amount of wordlists to be returned
 * @param {number} page As the data set is seen as a set of pages, this param represents the requested page
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to an array of wordlists
 */
const listPublic = ({ pageSize = config.defaultPageSize, page = 0 }, user) => {
  const skip = page > 0 ? page * pageSize : 0;
  return WordlistDao.find({ owner: { $ne: user._id }, isPrivate: false }, null, {
    limit: pageSize,
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
const save = (wordlist, user) => {
  return WordlistDao.create({ ...wordlist, owner: user._id });
};

/**
 * Search the database for a wordlist with an _id
 *
 * @param {string|mongoose.Types.ObjectId} id the wordlist id
 * @param {object} user The authenticated user, owner of the wordlist
 * @param {mongoose.Types.ObjectId} user._id The user id
 *
 * @returns {Promise} A promise, which resolves to the persisted object, if found
 */
const get = (id, user) => {
  const query = { _id: id };
  if (user) {
    query.owner = user._id;
  }
  return WordlistDao.findOne(query);
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

const api = {
  list,
  listPublic,
  save,
  get,
  update,
  delete: remove
};

module.exports = api;
