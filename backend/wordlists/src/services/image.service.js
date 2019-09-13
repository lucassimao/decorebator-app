const WordlistDao = require("../dao/wordlist.dao");
const filestorageService = require('./filestorage.service');

const addImage = async (idWordlist, idWord, { fileName, base64Image, description },user) => {
  const url = await filestorageService.store(user,fileName,base64Image); 
  return WordlistDao.addImage(idWordlist, idWord,{url,description},user)
};

const deleteImage = (idWordlist, idWord, idImage) => {
  return WordlistDao.updateOne(
    { _id: idWordlist, "words._id": idWord },
    { $pull: { "words.$.images": { _id: idImage } } }
  );
};

const patchImage = (idWordlist, idWord, idImage, updateObject) => {

    const updateCommand = Object.keys(updateObject).reduce((command,property) => {
        command[`words.$[w].images.$[i].${property}`] = updateObject[property];
        return command;
    },{})

    return WordlistDao.updateOne(
        { _id: idWordlist},
        { $set: updateCommand },
        {  arrayFilters: [ { "w._id": idWord }, { "i._id": idImage } ]}
      );
};

module.exports = { addImage, deleteImage, patchImage };
