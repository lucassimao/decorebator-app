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
  let app, jwtToken, wordlist, user;

  beforeAll(async () => {
    app = await setupTestEnvironment("/", rootRouter, true);
    user = await AuthService.register("image.router@hotmail.com", "112358");
    jwtToken = await AuthService.doLogin("image.router@hotmail.com", "112358");
  });

  beforeEach(async () => {
    wordlist = await WordlistService.save(object, user);
  });

  afterEach(async () => {
    // await WordlistService.deleteAll();
    await AuthService.removeAccount("image.router.another@hotmail.com");
  });

  afterAll(async () => {
    await AuthService.removeAccount("image.router@hotmail.com");
    // await WordlistService.deleteAll();
  });

  it("should return status 403 after trying to manipulate images from a wordlist of a different user", async done => {
    const anotherUser = await AuthService.register("image.router.another@hotmail.com", "123456");
    const anotherUserToken = await AuthService.doLogin("image.router.another@hotmail.com", "123456");
    const base64Image = await loadAsBase64(`${__dirname}/fixtures/book.jpeg`);

    const response = await request(app)
      .post("/wordlists")
      .set("authorization", `Bearer ${anotherUserToken}`)
      .send(object)
      .expect(201);

    const link = response.headers["link"];
    const regex = /\/wordlists\/(\S{24})$/;
    const id = regex.exec(link)[1];
    const wordlist = await WordlistService.get(id, anotherUser);
    const firstWordId = String(wordlist.words[0]._id);

    // registering a new image
    const imgPostResponse = await request(app)
      .post(`${link}/words/${firstWordId}/images`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({ base64Image, description: "Image description", fileName: "book.jpeg" })
      .expect(201);

    const imgLink = imgPostResponse.headers["link"];

    // shoudn't add a new image with the wrong token
    await request(app)
      .post(`${link}/words/${firstWordId}/images`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({ base64Image, description: "Image description", fileName: "book.jpeg" })
      .expect(403);

    // shoudn't patch a image from a wordlist of a different user
    request(app)
      .patch(imgLink)
      .send({ description: "hacked image description" })
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403);

    // shoudn't delete a image from a wordlist of a different user
    request(app)
      .delete(imgLink)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403, done);
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
      .end(async err => {
        if (err) return done(err);

        const object = await WordlistService.get(idWordlist, user);
        expect(object.words).toHaveLength(1);
        expect(object.words[0].images).toHaveLength(1);
        expect(object.words[0].images[0].description).toBe("Image description");
        return done();
      });
  });

  it("should return 404 after POST new image to an inexisting wordlist", done => {
    request(app)
      .post("/wordlists/000000000000/words/111111111111/images")
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ base64Image: "", description: "Image description", fileName: "book.jpeg" })
      .expect(404, "wordlist not found", done);
  });

  it("should return 404 after POST new image to an inexisting word", done => {
    const idWordlist = wordlist._id;

    request(app)
      .post(`/wordlists/${idWordlist}/words/111111111111/images`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ base64Image: "", description: "Image description", fileName: "book.jpeg" })
      .expect(404, "word not found", done);
  });

  it("Should return a 204 after a successfull DELETE", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;
    const newImageId = await addImage(
      idWordlist,
      idFirstWord,
      user,
      `${__dirname}/fixtures/book.jpeg`,
      "book image"
    );

    request(app)
      .delete(`/wordlists/${idWordlist}/words/${idFirstWord}/images/${newImageId}`)
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (error, res) => {
        if (error) return done(error);

        expect((await WordlistService.get(idWordlist, user)).words[0].images).toHaveLength(0);
        return done();
      });
  });

  it("should return 404 after trying DELETE an image in an inexisting wordlist", done => {
    request(app)
      .delete("/wordlists/000000000000/words/111111111111/images/222222222222")
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .expect(404, "wordlist not found", done);
  });

  it("should return 404 after trying DELETE an image in an inexisting word", done => {
    const idWordlist = wordlist._id;

    request(app)
      .delete(`/wordlists/${idWordlist}/words/111111111111/images/222222222222`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .expect(404, "word not found", done);
  });

  it("should return 404 after trying DELETE an inexisting image", done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;

    request(app)
      .delete(`/wordlists/${idWordlist}/words/${idFirstWord}/images/222222222222`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .expect(404, "image not found", done);
  });

  it("it should return 204 after a successfull PATCH request", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;
    const newImageId = await addImage(
      idWordlist,
      idFirstWord,
      user,
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

        const object = await WordlistService.get(idWordlist, user);
        expect(object.words).toHaveLength(1);
        expect(object.words[0].images).toHaveLength(1);
        expect(object.words[0].images[0].description).toBe("right description");

        return done();
      });
  });

  it("should return 404 after trying PATCH an inexisting wordlist", done => {
    request(app)
      .patch("/wordlists/000000000000/words/111111111111/images/222222222222")
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ description: "new description" })
      .expect(404, "wordlist not found", done);
  });

  it("should return 404 after trying PATCH an image in an inexisting word", done => {
    const idWordlist = wordlist._id;

    request(app)
      .patch(`/wordlists/${idWordlist}/words/111111111111/images/222222222222`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ description: "new description" })
      .expect(404, "word not found", done);
  });

  it("it should return 404 after trying to PATCH a inexisting image", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;

    request(app)
      .patch(`/wordlists/${idWordlist}/words/${idFirstWord}/images/000000000000`)
      .set("authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ description: "new description" })
      .expect(404, "image not found", done);
  });
});

async function addImage(idWordlist, idFirstWord, user, fileName, description) {
  const base64Image = await loadAsBase64(fileName);

  const { words } = await imageService.addImage(
    idWordlist,
    idFirstWord,
    {
      base64Image,
      description,
      fileName
    },
    user
  );

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
