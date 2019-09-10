const config = require("decorebator-common").config;
const WordlistDao = require("../dao/wordlist.dao");

const list = ({ pageSize = config.defaultPageSize, page = 0 }, user) => {
  const skip = page > 0 ? (page - 1) * pageSize : 0;
  return WordlistDao.find({ owner: user._id }, null, { limit: pageSize, skip });
};

const save = (wordlist, user) => {
  return WordlistDao.create({ ...wordlist, owner: user._id });
};

const get = (id, user) => {
  return WordlistDao.findOne({ _id: id, owner: user._id });
};

const update = (id, updateObj, user) => {
  return WordlistDao.updateOne({ _id: id, owner: user._id }, updateObj);
};

const deleteAll = () => {
  return WordlistDao.deleteMany({});
};

const remove = (id, user) => {
  return WordlistDao.deleteOne({ _id: id, owner: user._id });
};

const api = {
  list,
  save,
  get,
  update,
  delete: remove
};

if (config.isTest) api.deleteAll = deleteAll;

module.exports = api;
