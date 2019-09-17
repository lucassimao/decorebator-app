const request = require("supertest");
const { AuthService, setupTestEnvironment } = require("decorebator-common");

const rootRouter = require("../../routers");
const WordlistService = require("../../services/wordlist.service");

const object = {
  owner: null,
  description: "List of words in the NY article",
  name: "Words - 1",
  language: "en",
  words: [{ name: "test" }]
};

describe("Tests for the restful api of words ", () => {
  let app, jwtToken, wordlist, user;

  beforeAll(async () => {
    app = await setupTestEnvironment("/", rootRouter, true);
    user = await AuthService.register("teste@gmail.com", "112358");
    jwtToken = await AuthService.doLogin("teste@gmail.com", "112358");
  });

  beforeEach(async () => {
    wordlist = await WordlistService.save(object, user);
  });

  afterEach(async () => {
    // await WordlistService.deleteAll();
    await AuthService.removeAccount("another@gmail.com");
  });

  afterAll(async () => {
    await AuthService.removeAccount("teste@gmail.com");
    // await WordlistService.deleteAll();
  });

  it("should return a 401 status code for any non authenticated request", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;

    await request(app)
      .get(`/wordlists/${idWordlist}/words`)
      .expect(401);
    await request(app)
      .post(`/wordlists/${idWordlist}/words`)
      .send({ name: "test" })
      .expect(401);

    await request(app)
      .get(`/wordlists/${idWordlist}/words/${idFirstWord}`)
      .expect(401);
    await request(app)
      .patch(`/wordlists/${idWordlist}/words/${idFirstWord}`)
      .send({ name: "hacked name" })
      .expect(401);
    await request(app)
      .delete(`/wordlists/${idWordlist}/words/${idFirstWord}`)
      .expect(401);

    request(app)
      .get(`/wordlists/${idWordlist}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        expect("words" in res.body).toBeTruthy();
        expect(Array.isArray(res.body.words)).toBeTruthy();
        expect(res.body.words).toHaveLength(1);
        expect(res.body.words[0].name).toBe("test");

        return done();
      });
  });

  it("should return status 403 after trying to manipulate a word from a wordlist of a different user", async done => {
    const anotherUser = await AuthService.register("another@gmail.com", "123456");
    const anotherUserToken = await AuthService.doLogin("another@gmail.com", "123456");

    const response = await request(app)
      .post("/wordlists")
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send(object)
      .expect(201);

    const link = response.headers["link"];
    const regex = /\/wordlists\/(\S{24})$/;
    const id = regex.exec(link)[1];
    const wordlist = await WordlistService.get(id, anotherUser);
    const firstWordId = String(wordlist.words[0]._id);


    // shoudn't read a word from a wordlist of a different user
    await request(app)
      .get(`${link}/words/${firstWordId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403);   

    // shoudn't add a new word
    await request(app)
      .post(`${link}/words`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({ name: "new word" })
      .expect(403);

    // shoudn't patch a word from a wordlist of a different user
    await request(app)
      .patch(`${link}/words/${firstWordId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({ name: "updated word" })
      .expect(403);

    // shoudn't delete a word from a wordlist of a different user
    request(app)
      .delete(`${link}/words/${firstWordId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403,done);      
  });

  it("should return status 200 if it was able to return the words after a GET", done => {
    const idWordlist = wordlist._id;

    request(app)
      .get(`/wordlists/${idWordlist}/words`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        expect("words" in res.body).toBeTruthy();
        expect(Array.isArray(res.body.words)).toBeTruthy();
        expect(res.body.words).toHaveLength(1);
        done();
      });
  });

  it("should return status 201 if it was able to add a new word to a wordlist after POST to /wordlists/:id/words", async done => {
    const idWordlist = wordlist._id;

    request(app)
      .post(`/wordlists/${idWordlist}/words`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        name: "winner"
      })
      .expect(201, {})
      .expect("link", new RegExp(`/wordlists/${idWordlist}/words/(\\S{24})$`))
      .end(async (err, res) => {
        if (err) return done(err);

        const wordlist = await WordlistService.get(idWordlist, user);
        expect(wordlist.words).toHaveLength(2);
        expect(wordlist.words[1].name).toBe("winner");

        return done();
      });
  });

  it("should return status 204 if it was able to PATCH an existing a word", async done => {
    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;

    request(app)
      .patch(`/wordlists/${idWordlist}/words/${idFirstWord}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .set("content-type", "application/json")
      .send({ name: "victory" })
      .expect(204, {})
      .end(async (err, res) => {
        if (err) done(err);

        const wordlist = await WordlistService.get(idWordlist, user);
        expect(wordlist.words).toHaveLength(1);
        expect(wordlist.words[0].name).toBe("victory");
        expect(String(wordlist.words[0]._id)).toBe(String(idFirstWord));
        return done();
      });
  });

  it("should return the status 204 if it was able to remove a word from a wordlist", async done => {
    // trying to delete from an inexisting wordlist returns 404 status code
    await request(app)
      .delete("/wordlists/000000000000/words/000000000000")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    const idWordlist = wordlist._id;
    const idFirstWord = wordlist.words[0]._id;

    // trying to delete from an inexisting word from an EXISTING wordlist, also returns 404 status code
    await request(app)
      .delete(`/wordlists/${idWordlist}/words/aaaaaaaaaaaa`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404);

    request(app)
      .delete(`/wordlists/${idWordlist}/words/${idFirstWord}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(204, {})
      .end(async (err, res) => {
        if (err) return done(err);

        const wordlist = await WordlistService.get(idWordlist, user);
        expect(wordlist.words).toHaveLength(0);
        return done();
      });
  });
});
