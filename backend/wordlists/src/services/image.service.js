const WordlistDao = require("../dao/wordlist.dao");
const filestorageService = require("./filestorage.service");

const addImage = async (idWordlist, idWord, { fileName, base64Image, description }, user) => {
  const url = await filestorageService.store(user, fileName, base64Image);
  return WordlistDao.addImage(idWordlist, idWord, { url, description }, user);
};

const deleteImage = (idWordlist, idWord, idImage, user) => {
  return WordlistDao.deleteImage(idWordlist, idWord, idImage, user);
};

const patchImage = (idWordlist, idWord, idImage, updateObject, user) => {
  return WordlistDao.patchImage(idWordlist, idWord, idImage, updateObject, user);
};

module.exports = { addImage, deleteImage, patchImage };
