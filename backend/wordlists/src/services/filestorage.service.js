const crypto = require('crypto');
const os = require("os");
const path = require("path");
const shortid = require("shortid");
const fsPromises = require('fs').promises;
const AWS = require('aws-sdk');
const config = require("decorebator-common").config;


/**
 * persists a file. In production environment, sends the data to amazon S3, otherwise stores in the local system's temp dir 
 * 
 * @param {object} user The user storing the file
 * @param {mongoose.Types.ObjectId} user._id The user id 
 * @param {string} fileName The original filename sent by the user
 * @param {string} base64EncodedFile The binary data encoded as base64 format
 * 
 * @returns {string} link to the file
 */
const store = async (user, fileName, base64EncodedFile) => {
  const ext = path.extname(fileName);
  const buffer = Buffer.from(base64EncodedFile, 'base64');

  if (config.isDev || config.isTest) {
    const localPath = path.join(os.tmpdir(), shortid.generate() + ext)

    await fsPromises.writeFile(localPath, buffer);
    return localPath
  } else {

    const bucketName = String(user._id);
    const keyName = shortid.generate() + ext;
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    await s3.createBucket({ Bucket: bucketName }).promise();

    const hash = crypto.createHash('md5');
    hash.update(buffer);
    const md5sum = hash.digest('base64');

    var objectParams = { ACL: "public-read", Bucket: bucketName, Key: keyName, Body: buffer, ContentMD5: md5sum };
    await s3.putObject(objectParams).promise();

    return `https://${bucketName}.s3.amazonaws.com/${keyName}`;
  }
};

module.exports = {
  store
}