const request = require("supertest");
const fsPromises = require("fs").promises;
const { AuthService, setupTestEnvironment } = require("decorebator-common");

const WordlistRouter = require("../../controllers/wordlist.controller");
const WordlistService = require("../../services/wordlist.service");

const wordlist = {
  owner: null,
  description: "List of words found in the Lord of Rings book",
  name: "Words - 1",
  language: "en",
  words: []
};

// testing the Wordlist restful API
describe("Wordlist's restful API test", () => {
  let jwtToken;
  let app;

  beforeAll(async () => {
    app = await setupTestEnvironment("/wordlists", WordlistRouter, true);
    await AuthService.register("teste@gmail.com", "112358");
    jwtToken = await AuthService.doLogin("teste@gmail.com", "112358");
  });

  afterAll(async () => {
    await AuthService.removeAccount("teste@gmail.com");
  });

  beforeEach(async () => {
    await WordlistService.deleteAll();
  });

  it("should return a 401 status code for any non authenticated request", async () => {
    await request(app)
      .get("/wordlists")
      .expect(401);
    await request(app)
      .post("/wordlists")
      .send(wordlist)
      .expect(401);

    const object = await WordlistService.save({ ...wordlist, words: [{ name: "name 1" }] });

    await request(app)
      .get(`/wordlists/${object._id}`)
      .expect(401);
    await request(app)
      .patch(`/wordlists/${object._id}`)
      .send({ name: "hacked name" })
      .expect(401);
    await request(app)
      .delete(`/wordlists/${object._id}`)
      .expect(401);

    await request(app)
      .post(`/wordlists/${object._id}/words`)
      .send({ name: "new word" })
      .expect(401);
    expect((await WordlistService.get(object._id)).words.length).toBe(1);

    await request(app)
      .delete(`/wordlists/${object._id}/words/0`)
      .expect(401);
  });

  it("A GET request to /wordlits returns an user's newest wordlists", done => {
    request(app)
      .get("/wordlists")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect("Content-Type", /json/)
      .expect(200, { wordlists: [] }, done);
  });

  it("should return http status 201 if it was able to create a new wordlist after a POST request", done => {
    request(app)
      .post("/wordlists")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(wordlist)
      .expect(201, {})
      .expect("link", /\/wordlists\/\S{24}$/)
      .end(async (error, res) => {
        if (error) return done(error);

        const link = res.header["link"];
        const regex = /\/wordlists\/(\S+)$/;
        const match = regex.exec(link);
        const id = match[1];

        const obj = await WordlistService.get(id);
        expect(obj.name).toBe("Words - 1");

        return done();
      });
  });

  it("should create a new wordlist from a simple list of words", done => {
    request(app)
      .post("/wordlists")
      .set("authorization", `Bearer ${jwtToken}`)
      .field("description", wordlist.description)
      .field("language", wordlist.language)
      .field("name", wordlist.name)
      .attach("words", `${__dirname}/fixtures/1-1000.txt`)
      .expect(201, {})
      .expect("link", /\/wordlists\/\S{24}$/)
      .end(async (error, res) => {
        if (error) return done(error);

        const link = res.header["link"];
        const regex = /\/wordlists\/(\S+)$/;
        const match = regex.exec(link);
        const id = match[1];

        const wordlist = await WordlistService.get(id);
        expect(wordlist.words.length).toBe(1000);
        done();
      });
  });

  it("should return the status 204 if it was able to partially update a wordlist after a PATCH request", async done => {
    await request(app)
      .patch("/wordlists/inexisting12")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    const object = await WordlistService.save(wordlist);

    request(app)
      .patch(`/wordlists/${object._id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        name: "My wordlist"
      })
      .expect(204, {})
      .end(async (error, res) => {
        if (error) {
          return done(error);
        }

        const wordlist = await WordlistService.get(object._id);
        expect(wordlist.name).toBe("My wordlist");

        return done();
      });
  });

  it("should return status 204 if it was able to add a new word to a wordlist after POST to /wordlists/:id/words", async done => {
    await request(app)
      .post("/wordlists/inexisting12/words")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    const object = await WordlistService.save({ ...wordlist, words: [{ name: "success" }] });

    request(app)
      .post(`/wordlists/${object._id}/words`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        name: "winner"
      })
      .expect(204, {})
      .expect("link", new RegExp(`/wordlists/${object._id}/words/(\\S{24})$`))
      .end(async (err, res) => {
        if (err) return done(err);

        const wordlist = await WordlistService.get(object._id);
        expect(wordlist.words.length).toBe(2);
        return done();
      });
  });

  it("should return status 201 if it was able to add a new image to a existing word inside a wordlist", async done => {
    const object = await WordlistService.save({ ...wordlist, words: [{ name: "book" }] });
    expect(object.words[0].image).toBeFalsy();

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
      .post(`/wordlists/${object._id}/words/${object.words[0]._id}/images`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ image: base64Image })
      .expect("link", new RegExp(`/wordlists/${object._id}/words/${object.words[0]._id}/images/(\\S{24})$`))
      .expect(201, {})
      .end(async (err, res) => {
        if (err) done(err);

        const wordlist = await WordlistService.get(object._id);
        expect(wordlist.words.length).toBe(1);
        expect(wordlist.words[0].images.length).toBe(1);
        return done();
      });
  });

  it("should return the status 204 if it was able to delete a wordlist", async done => {
    await request(app)
      .delete("/wordlists/inexisting12")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    const object = await WordlistService.save({ ...wordlist, words: [{ name: "success" }] });
    expect(await WordlistService.get(object._id)).not.toBeNull();

    request(app)
      .delete(`/wordlists/${object._id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (err, res) => {
        if (err) return done(err);

        const wordlist = await WordlistService.get(object._id);
        expect(wordlist).toBeNull();
        return done();
      });
  });

  it("should return the status 204 if it was able to remove a word from a wordlist", async done => {
    // trying to delete from an inexisting wordlist returns 404 status code
    await request(app)
      .delete("/wordlists/inexisting12/words/000000000000")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    const object = await WordlistService.save({ ...wordlist, words: [{ name: "success" }] });
    expect(await WordlistService.get(object._id)).not.toBeNull();

    // trying to delete from an inexisting position from an existing wordlist, also returns 404 status code
    await request(app)
      .delete(`/wordlists/${object._id}/words/aaaaaaaaaaaa`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    const firstWordId = object.words[0]._id;
    request(app)
      .delete(`/wordlists/${object._id}/words/${firstWordId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (err, res) => {
        if (err) return done(err);

        const wordlist = await WordlistService.get(object._id);
        expect(wordlist.words.length).toBe(0);
        return done();
      });
  });
});
