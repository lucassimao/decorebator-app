import { promises as fsPromises } from "fs";
import os from "os";
import path from "path";
import shortid from "shortid";
import User from "../entities/user";

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
const store = async (
  user: User,
  fileName: string,
  base64EncodedFile: string
) => {
  const ext = path.extname(fileName);
  const buffer = Buffer.from(base64EncodedFile, "base64");

  if (process.env.NODE_ENV !== "production") {
    const localPath = path.join(os.tmpdir(), shortid.generate() + ext);

    await fsPromises.writeFile(localPath, buffer);
    return `https://www.decorebator.com/${localPath}`;
  } else {
    throw new Error("not implemented yet");
  }
};

export default { store };
