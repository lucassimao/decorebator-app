const https = require("https");
const fs = require("fs");
const fsPromises = require("fs").promises;
const crypto = require("crypto");
const os = require("os");
const service = require("../filestorage.service");

describe("File storage service tests", () => {
  it("on non production environment, file should be stored on the local system's temp dir", async done => {
    const filepath = __dirname + "/fixtures/file.pdf";

    const originalFileMd5 = await getFileMd5(filepath);
    const content = await readFileContentAsBase64(filepath);
    const copiedFilepath = await service.store(
      { _id: 123 },
      "file.pdf",
      content
    );
    const copiedFileMd5 = await getFileMd5(copiedFilepath);

    await fsPromises.access(filepath, fs.constants.R_OK);
    expect(originalFileMd5).toBe(copiedFileMd5);
    expect(copiedFilepath).toMatch(new RegExp(`^${os.tmpdir()}/`));
    done();
  });

  it("should upload the file in production to amazon s3", async done => {
    const filepath = __dirname + "/fixtures/file.pdf";
    const originalFileMd5 = await getFileMd5(filepath);
    const content = await readFileContentAsBase64(filepath);

    const uri = await service.storeOnAmazonS3(
      "wordlists-test-03410718389",
      "file.pdf",
      content
    );
    https.get(uri, res => {
      expect(res.statusCode).toBe(200);
      const contentLength = parseInt(res.headers["content-length"]);

      const buffers = [];
      res.on("data", chunk => {
        buffers.push(chunk);
      });
      res.on("end", async () => {
        const downloadFileBuffer = Buffer.concat(buffers, contentLength);
        const hash = crypto.createHash("md5");
        hash.update(downloadFileBuffer);

        expect(originalFileMd5).toBe(hash.digest("base64"));
        await service.removeS3File(uri);
        done();
      });
    });
  });
});

async function readFileContentAsBase64(filepath) {
  let fileHandle;

  try {
    fileHandle = await fsPromises.open(filepath, "r");
    const buffer = await fileHandle.readFile();
    const base64Content = buffer.toString("base64");
    return base64Content;
  } finally {
    if (fileHandle) fileHandle.close();
  }
}

async function getFileMd5(filepath) {
  const base64Content = await readFileContentAsBase64(filepath);
  const hash = crypto.createHash("md5");
  hash.update(base64Content);
  return hash.digest("base64");
}
