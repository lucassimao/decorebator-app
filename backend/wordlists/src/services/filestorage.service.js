const crypto = require("crypto");
const os = require("os");
const path = require("path");
const shortid = require("shortid");
const fsPromises = require("fs").promises;
const AWS = require("aws-sdk");
const config = require("../config");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

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
  const buffer = Buffer.from(base64EncodedFile, "base64");

  if (config.isDev || config.isTest) {
    const localPath = path.join(os.tmpdir(), shortid.generate() + ext);

    await fsPromises.writeFile(localPath, buffer);
    return localPath;
  } else {
    return await storeOnAmazonS3(ext, buffer);
  }
};

/**
 *
 * store a buffer as a new file on amazon s3
 *
 * @param {string} extension file extension e.g: '.pdf'
 * @param {Buffer} buffer file content
 */
async function storeOnAmazonS3(extension, buffer) {
  const bucketName = "decorebator";
  const keyName = shortid.generate() + extension;

  await s3.createBucket({ Bucket: "decorebator" }).promise();

  const hash = crypto.createHash("md5");
  hash.update(buffer);
  const md5sum = hash.digest("base64");

  var objectParams = {
    ACL: "public-read",
    Bucket: bucketName,
    Key: keyName,
    Body: buffer,
    ContentMD5: md5sum
  };
  await s3.putObject(objectParams).promise();

  return `https://${bucketName}.s3.amazonaws.com/${keyName}`;
}

async function removeS3File(uri) {
  const regex = /https:\/\/(\S+).s3.amazonaws.com\/(\S+)$/;
  const match = regex.exec(uri);
  const Bucket = match[1],
    Key = match[2];

  const params = {
    Bucket,
    Key
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

let api;
if (config.isTest) {
  api = {
    store,
    storeOnAmazonS3,
    removeS3File
  };
} else {
  api = { store };
}

module.exports = api;
