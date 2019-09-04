const request = require("supertest");
const { AuthService, setupTestEnvironment } = require("decorebator-common");
const fsPromises = require("fs").promises;

const rootRouter = require("../../routers");
const WordlistService = require("../../services/wordlist.service");
const imageService = require("../../services/image.service");

const object = {
  owner: null,
  description: "List of words found in the Lord of Rings book",
  name: "Words - 1",
  language: "en",
  words: [{ name: "test" }]
};

describe("Tests for the restful api of image's words ", () => {
  let app, jwtToken, wordlist;

  beforeAll(async () => {
    app = await setupTestEnvironment("/", rootRouter, true);
    await AuthService.register("teste@gmail.com", "112358");
    jwtToken = await AuthService.doLogin("teste@gmail.com", "112358");
  });

  beforeEach(async () => {
    wordlist = await WordlistService.save(object);
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

    let fileHandle, base64Image;
    try {
      fileHandle = await fsPromises.open(`${__dirname}/fixtures/book.jpeg`, "r");
      const buffer = await fileHandle.readFile();
      base64Image = buffer.toString("base64");
    } catch (error) {
      return done(error);
    } finally {
      if (fileHandle) fileHandle.close();
    }

    request(app)
      .post(`/wordlists/${idWordlist}/words/${idFirstWord}/images`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ image: base64Image })
      .expect(201, {})
      .expect("link", new RegExp(`/wordlists/${idWordlist}/words/${idFirstWord}/images/(\\S{24})$`))
      .end(async (err, res) => {
        if (err) return done(err);

        const object = await WordlistService.get(idWordlist);
        expect(object.words.length).toBe(1);
        expect(object.words[0].images.length).toBe(1);
        return done();
      });
  });

  it("Should return a 204 code after a DELETE", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;
    let newImageId;

    let fileHandle, base64Image;
    try {
      fileHandle = await fsPromises.open(`${__dirname}/fixtures/book.jpeg`, "r");
      const buffer = await fileHandle.readFile();
      base64Image = buffer.toString("base64");

      const { words } = await imageService.addImage(idWordlist, idFirstWord, { image: base64Image });

      const word = words.find(w => String(w._id) == String(idFirstWord));
      newImageId = word.images[word.images.length - 1]._id;
    } catch (error) {
      return done(error);
    } finally {
      if (fileHandle) fileHandle.close();
    }

    request(app)
      .delete(`/wordlists/${idWordlist}/words/${idFirstWord}/images/${newImageId}`)
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (error, res) => {
        if (error) return done(error);

        expect((await WordlistService.get(idWordlist)).words[0].images.length).toBe(0);
        done();
      });
  });
});
