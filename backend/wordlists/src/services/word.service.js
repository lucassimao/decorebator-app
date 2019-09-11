const WordlistDao = require("../dao/wordlist.dao");

const get = (idWordlist,idWord,user) => {
  return WordlistDao.getWord(idWordlist,idWord,user);
};

const getAll = (idWordlist,user) => {
    return WordlistDao.getAllWords(idWordlist,user);
  };

const addWord = (idWordlist, newWordObject, user) => {
  return WordlistDao.addWord(idWordlist, newWordObject, user);
};

const patchWord = (idWordlist, idWord, updateObject, user) => {
  return WordlistDao.patchWord(idWordlist, idWord, updateObject, user);
};

const deleteWord = (idWordlist, idWord, user) => {
  return WordlistDao.deleteWord(idWordlist, idWord, user);
};

module.exports = {
  get,getAll,
  addWord,
  patchWord,
  delete: deleteWord
};
