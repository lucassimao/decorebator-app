const request = require("supertest");
const { AuthService, setupTestEnvironment } = require("decorebator-common");
const fsPromises = require("fs").promises;

const rootRouter = require("../../routers");
const WordlistService = require("../../services/wordlist.service");
const imageService = require("../../services/image.service");

const object = {
  owner: null,
  description: "List of words found in my book",
  name: "Words - 1",
  language: "en",
  words: [{ name: "test" }]
};

describe("Tests for the restful api of image's words ", () => {
  let app, jwtToken, wordlist,user;

  beforeAll(async () => {
    app = await setupTestEnvironment("/", rootRouter, true);
    user = await AuthService.register("teste@gmail.com", "112358");
    jwtToken = await AuthService.doLogin("teste@gmail.com", "112358");
  });

  beforeEach(async () => {
    wordlist = await WordlistService.save(object,user);
  });

  afterEach(async () => {
    await WordlistService.deleteAll();
  });

  afterAll(async () => {
    await AuthService.removeAccount("teste@gmail.com");
    await WordlistService.deleteAll();
  });

  it("should return 201 after POST to /wordlists/:idWordlist/word/:idWord/images ", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;
    const base64Image = await loadAsBase64(`${__dirname}/fixtures/book.jpeg`);


    request(app)
      .post(`/wordlists/${idWordlist}/words/${idFirstWord}/images`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ base64Image, description: "Image description", fileName: "book.jpeg" })
      .expect(201, {})
      .expect("link", new RegExp(`/wordlists/${idWordlist}/words/${idFirstWord}/images/(\\S{24})$`))
      .end(async (err, ) => {
        if (err) return done(err);

        const object = await WordlistService.get(idWordlist,user);
        expect(object.words).toHaveLength(1);
        expect(object.words[0].images).toHaveLength(1);
        expect(object.words[0].images[0].description).toBe("Image description");
        return done();
      });
  });

  it("Should return a 204 code after a DELETE", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;
    const newImageId = await addImage(idWordlist, idFirstWord,user, `${__dirname}/fixtures/book.jpeg`, "book image");

    request(app)
      .delete(`/wordlists/${idWordlist}/words/${idFirstWord}/images/${newImageId}`)
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (error, res) => {
        if (error) return done(error);

        expect((await WordlistService.get(idWordlist,user)).words[0].images).toHaveLength(0);
        done();
      });
  });

  it("it should return 204 after a PATCH request", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;
    const newImageId = await addImage(
      idWordlist,
      idFirstWord, user,
      `${__dirname}/fixtures/book.jpeg`,
      "wrong description"
    );

    request(app)
      .patch(`/wordlists/${idWordlist}/words/${idFirstWord}/images/${newImageId}`)
      .send({ description: "right description" })
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (err, res) => {
        if (err) return done(err);

        const object = await WordlistService.get(idWordlist,user);
        expect(object.words).toHaveLength(1);
        expect(object.words[0].images).toHaveLength(1);
        expect(object.words[0].images[0].description).toBe("right description");

        return done();
      });
  });
});

async function addImage(idWordlist, idFirstWord,user, fileName, description) {
  const base64Image = await loadAsBase64(fileName);

  const { words } = await imageService.addImage(idWordlist, idFirstWord,user, {
    base64Image,
    description,
    fileName
  });

  const word = words.find(w => String(w._id) == String(idFirstWord));
  const newImageId = word.images[word.images.length - 1]._id;
  return newImageId;
}

async function loadAsBase64(filename) {
  let fileHandle, base64Image;
  try {
    fileHandle = await fsPromises.open(filename, "r");
    const buffer = await fileHandle.readFile();
    base64Image = buffer.toString("base64");
    return base64Image;
  } finally {
    if (fileHandle) fileHandle.close();
  }
}
