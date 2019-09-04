const request = require("supertest");
const { AuthService, setupTestEnvironment } = require("decorebator-common");

const rootRouter = require("../../routers");
const WordlistService = require("../../services/wordlist.service");


const object = {
  owner: null,
  description: "List of words found in the Lord of Rings book",
  name: "Words - 1",
  language: "en",
  words: [{ name: "test" }]
};

describe("Tests for the restful api of words ", () => {
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

  it("should return a 401 status code for any non authenticated request", async () => {
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

    expect((await WordlistService.get(idWordlist)).words.length).toBe(1);
    expect((await WordlistService.get(idWordlist)).words[0].name).toBe("test");
  });

  it("should return status 200 if it was able to return the words after a GET", done => {
    const idWordlist = wordlist._id;

    request(app)
      .get(`/wordlists/${idWordlist}/words`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end((error,res)=>{
          if (error){
              done(error)
          }
          expect('words' in res.body).toBeTruthy();
          expect(Array.isArray(res.body.words)).toBeTruthy();
          expect(res.body.words.length).toBe(1);
          done();
      })
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

        const wordlist = await WordlistService.get(idWordlist);
        expect(wordlist.words.length).toBe(2);
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

        const wordlist = await WordlistService.get(idWordlist);
        expect(wordlist.words.length).toBe(1);
        expect(wordlist.words[0].name).toBe("victory");
        expect(String(wordlist.words[0]._id)).toBe(String(idFirstWord));
        return done();
      });
  });

  it.only("should return the status 204 if it was able to remove a word from a wordlist", async done => {
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

        const wordlist = await WordlistService.get(idWordlist);
        expect(wordlist.words.length).toBe(0);
        return done();
      });
  });
});
