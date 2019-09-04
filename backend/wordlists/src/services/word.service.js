const WordlistDao = require("../dao/wordlist.dao");

const get = idWordlist => {
  return WordlistDao.findOne({ _id: idWordlist }, "words", { lean: true });
};

const addWord = (idWordlist, newWordObject) => {
  return WordlistDao.findByIdAndUpdate(
    idWordlist,
    { $push: { words: newWordObject } },
    { lean: true, new: true, select: "words" }
  );
};

const patchWord = (idWordlist, idWord, updateObject) => {
    const updateCommand = Object.keys(updateObject).reduce((command,property) => {
        command[`words.$.${property}`] = updateObject[property];
        return command;
    },{})

  return WordlistDao.updateOne(
    { _id: idWordlist, "words._id": idWord },
    { $set: updateCommand }
  );
};

const deleteWord = (idWordlist, idWord) => {
    return WordlistDao.updateOne({ _id: idWordlist }, { $pull: { words: { _id: idWord } } });
}


module.exports = {
  get,
  addWord,
  patchWord,
  delete: deleteWord
};
