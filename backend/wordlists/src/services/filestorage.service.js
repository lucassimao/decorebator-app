const os = require("os");
const path = require("path");
const shortid = require("shortid");
const fsPromises = require('fs').promises;
const config = require("decorebator-common").config;


const store = async (fileName, base64EncodedFile) => {
  if (config.isDev || config.isTest) {
    const newFileName = shortid.generate();
    const ext = path.extname(fileName);
    const localPath = path.join(os.tmpdir(),newFileName + ext)
    const buffer = Buffer.from(base64EncodedFile, 'base64');
    await fsPromises.writeFile(localPath, buffer);
    return localPath
  } else {

  }
};


module.exports = {
    store
}