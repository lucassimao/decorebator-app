const request = require("supertest");
const { AuthService, setupTestEnvironment } = require("decorebator-common");

const rootRouter = require("../../routers");
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
    app = await setupTestEnvironment("/", rootRouter, true);
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
  });

  // TODO test wordlists pagination
  it("A GET request to /wordlists returns an user's newest wordlists", done => {
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
        expect(wordlist.words).toHaveLength(1000);
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


});
