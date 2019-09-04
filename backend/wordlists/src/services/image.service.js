const WordlistDao = require("../dao/wordlist.dao");

const addImage = (idWordlist, idWord, image) => {
    const url = 'http:// ...'; // save image to remote storage
    
    return WordlistDao.findOneAndUpdate(
      { _id: idWordlist, "words._id": idWord },
      { $push: { "words.$.images": {url} } },
      { new: true, lean:true ,select: "words.images words._id" }
    );
  };

const deleteImage = (idWordlist, idWord, idImage) => {
    return WordlistDao.updateOne({ _id: idWordlist, "words._id": idWord }, { $pull: { "words.$.images": { _id: idImage } } });
}

module.exports = {addImage, deleteImage}