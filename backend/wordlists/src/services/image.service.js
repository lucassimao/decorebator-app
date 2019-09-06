const WordlistDao = require("../dao/wordlist.dao");
const filestorageService = require('./filestorage.service');

const addImage = async (idWordlist, idWord, { fileName, base64Image, description }) => {
  const url = await filestorageService.store(fileName,base64Image); 

  return WordlistDao.findOneAndUpdate(
    { _id: idWordlist, "words._id": idWord },
    { $push: { "words.$.images": { url, description } } },
    { new: true, lean: true, select: "words.images words._id" }
  );
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
