const config = require("decorebator-common").config;
const WordlistDao = require("../dao/wordlist.dao");

const list = (user, { pageSize = config.defaultPageSize, page = 0 }) => {
  const skip = page > 0 ? (page - 1) * pageSize : 0;
  return WordlistDao.find({ owner : user._id }, null, { limit: pageSize, skip });
};

const save = (wordlist,user) => {
  return WordlistDao.create({ ... wordlist, owner: user._id});
};

const get = (id,user) => {
  return WordlistDao.findOne({ _id: id, owner: user._id });
};

const update = (id, user, updateObj) => {
  return WordlistDao.updateOne({ _id: id, owner: user._id  }, updateObj);
};

const deleteAll = () => {
  return WordlistDao.deleteMany({});
};

const remove = (user,id) => {
  return WordlistDao.deleteOne({ _id: id, owner: user._id  });
};

module.exports = {
  list,
  save,
  get,
  update,
  delete: remove,
  deleteAll,
};
