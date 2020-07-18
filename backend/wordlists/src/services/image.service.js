const filestorageService = require("./filestorage.service");
const { config: {logger}, ImageRepository } = require('@lucassimao/decorabator-common')

const addImage = async (
  idWordlist,
  idWord,
  { fileName, base64Image, description },
  user
) => {
  const url = await filestorageService.store(user, fileName, base64Image);
  return ImageRepository.addImage(idWordlist, idWord,user.id, { url, description });
};

const deleteImage = (idWordlist, idWord, idImage, user) => {
  return ImageRepository.deleteImage(idWordlist, idWord,user.id, idImage);
};

const patchImage = (idWordlist, idWord, idImage, {url, description}, user) => {
  return ImageRepository.updateImage(idWordlist, idWord,user.id,idImage, {url,description});
};

module.exports = { addImage, deleteImage, patchImage };
