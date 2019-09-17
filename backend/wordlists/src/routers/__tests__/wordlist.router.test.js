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

describe("Wordlist's restful API test", () => {
  let jwtToken,
    app,
    userId,
    wordlistsFromAnotherUser = [];

  beforeAll(async () => {
    app = await setupTestEnvironment("/", rootRouter, true);
    const user = await AuthService.register("wordlist1@gmail.com", "112358");

    userId = user._id;
    jwtToken = await AuthService.doLogin("wordlist1@gmail.com", "112358");

    // registering 10 wordlists for a different user, in order to test multi tenancy
    const { _id } = await AuthService.register("wordlist2@gmail.com", "123");

    for (let i = 0; i < 10; ++i) {
      const object = await WordlistService.save(
        {
          owner: _id,
          description: `wordlist ${i}`,
          name: `wordlist ${i}`,
          language: "en",
          words: [{ name: "word 1" }]
        },
        { _id }
      );
      wordlistsFromAnotherUser.push(object);
    }
  });

  afterAll(async () => {
    await AuthService.removeAccount("wordlist1@gmail.com");
    await AuthService.removeAccount("wordlist2@gmail.com");
  });

  it("should return a 401 status code for any non authenticated request", async () => {
    await request(app)
      .get("/wordlists")
      .expect(401);
    await request(app)
      .post("/wordlists")
      .send(wordlist)
      .expect(401);

    const object = await WordlistService.save({ ...wordlist, words: [{ name: "name 1" }] }, { _id: userId });

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

    // cleanup
    await request(app)
      .delete(`/wordlists/${object._id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(204, {});
  });

  // TODO test wordlists pagination
  it("A GET request to /wordlists returns an user's newest wordlists", async done => {
    request(app)
      .get("/wordlists")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect("Content-Type", /json/)
      .expect(200, { wordlists: [] }, done);
  });

  it("should return status 403 trying to access a existing wordlist of a different user", done => {
    const { _id } = wordlistsFromAnotherUser[0];

    request(app)
      .get(`/wordlists/${_id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403, done);
  });  

  it("should return status 201 if it was able to create a new wordlist after a POST request", async done => {
    const postResponse = await request(app)
      .post("/wordlists")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(wordlist)
      .expect(201)
      .expect("link", /\/wordlists\/\S{24}$/);

    const link = postResponse.header["link"];

    request(app)
      .get(link)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body.name).toBe("Words - 1");
        expect(String(res.body.owner)).toBe(String(userId));

        return done();
      });
  });

  it("should create a new wordlist from a simple list of words", async done => {
    const postResponse = await request(app)
      .post("/wordlists")
      .set("authorization", `Bearer ${jwtToken}`)
      .field("description", wordlist.description)
      .field("language", wordlist.language)
      .field("name", wordlist.name)
      .attach("words", `${__dirname}/fixtures/1-1000.txt`)
      .expect(201, {})
      .expect("link", /\/wordlists\/\S{24}$/);

    const link = postResponse.headers["link"];

    request(app)
      .get(link)
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end(async (error, res) => {
        if (error) return done(error);

        const wordlist = res.body;
        expect(wordlist.words).toHaveLength(1000);
        expect(String(wordlist.owner)).toBe(String(userId));

        return done();
      });
  });

  it("should return status 404 after trying to update a inexisting wordlist", done => {
    request(app)
      .patch("/wordlists/000000000000")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it("should return status 403 after trying to PATCH a wordlist of another user", done => {
    const wordlistFromAnotherUser = wordlistsFromAnotherUser[0];
    // ensuring wordlist is form another user
    expect(String(wordlistFromAnotherUser.owner)).not.toBe(String(userId));

    const { _id } = wordlistsFromAnotherUser[0];

    request(app)
      .patch(`/wordlists/${_id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403, done);
  });

  it("should return the status 204 if it was able to partially update a wordlist after a PATCH request", async done => {
    const postResponse = await request(app)
      .post(`/wordlists`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(wordlist)
      .expect(201, {});

    const link = postResponse.headers["link"];

    await request(app)
      .patch(link)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        name: "My wordlist - updated"
      })
      .expect(204, {});

    request(app)
      .get(link)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end(async (error, res) => {
        if (error) {
          return done(error);
        }

        const wordlist = res.body;
        expect(wordlist.name).toBe("My wordlist - updated");
        expect(String(wordlist.owner)).toBe(String(userId));

        return done();
      });
  });

  it("should return status 404 after a DELETE to a inexisting wordlist", done => {
    request(app)
      .delete("/wordlists/000000000000")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it("should return status 403 after a DELETE to a wordlist of a different user", done => {
    const { _id } = wordlistsFromAnotherUser[0];

    request(app)
      .delete(`/wordlists/${_id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(403, done);
  });

  it("should return the status 204 if it was able to delete a wordlist", async done => {
    const postResponse = await request(app)
      .post(`/wordlists`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(wordlist)
      .expect(201, {});

    const link = postResponse.headers["link"];

    request(app)
      .delete(link)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(204, {}, done);
  });
});
