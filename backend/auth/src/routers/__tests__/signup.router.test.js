const request = require("supertest");
const { AuthService, setupTestEnvironment } = require("decorebator-common");
const rootRooter = require("../../routers");

describe("Signup endpoint tests", () => {
  let app;

  beforeAll(async () => {
    app = await setupTestEnvironment("/", rootRooter, false);
  });

  beforeEach(async () => {
    await AuthService.removeAccount("signup.test@gmail.com");
    await AuthService.removeAccount("signup.test2@gmail.com");
  });

  it("Should be able to register a new user", done => {
    request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send({ login: "signup.test@gmail.com", name: "Lucas Simão", password: "123456789", country: "BR" })
      .expect(200, done);
  });

  it("should deny the registering of duplicate users", async done => {
    const user = {
      login: "signup.test2@gmail.com",
      name: "Lucas Simão",
      password: "123456789",
      country: "BR"
    };

    await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(user)
      .expect(200);

    request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(user)
      .expect(400, "User already exists", done);
  });

  it("should forbid unknown countries", done => {
    const user = {
      login: "signup.test@gmail.com",
      name: "Lucas Simão",
      password: "123456789",
      country: "INEXISTING"
    };

    request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(user)
      .expect(400, "Invalid country", done);
  });
});
