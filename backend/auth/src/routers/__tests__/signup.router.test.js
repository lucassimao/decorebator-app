const request = require("supertest");
const express = require("express");
const AuthService = require("../../services/auth.service");
const rootRooter = require("../../routers");
const { db } = require("decorebator-common");

describe("Signup endpoint tests", () => {
  let app;

  beforeAll(async () => {
    await db.connect();
    app = express();
    app.use("/", rootRooter);
  });

  afterAll(async () => {
    await db.disconnect();
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

  it("should deny registering with a invalid email", done => {
    const user = {
      login: "my login",
      name: "Lucas Simão",
      password: "123456789",
      country: "BR"
    };

    request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(user)
      .expect(400, "A valid email must be used as your account login", done);
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
