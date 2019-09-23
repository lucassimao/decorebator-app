const express = require("express");
const request = require("supertest");
const rootRooter = require("../../routers");
const AuthService = require("../../services/auth.service");
const { db } = require("decorebator-common");

describe("Login endpoint tests", () => {
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
    await AuthService.removeAccount("sigin.test@gmail.com");
  });

  it("A registered user should be able to login", async done => {
    await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send({ login: "sigin.test@gmail.com", name: "Lucas Simão", password: "123456789", country: "BR" })
      .expect(200);

    request(app)
      .post("/signin")
      .set("content-type", "application/json")
      .send({ login: "sigin.test@gmail.com", password: "123456789" })
      .expect(200)
      .expect("authorization", /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, done);
  });

  it("The password and login field are required in order to login", async done => {
    await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send({ login: "sigin.test@gmail.com", name: "Lucas Simão", password: "123456789", country: "BR" })
      .expect(200);

    await request(app)
      .post("/signin")
      .set("content-type", "application/json")
      .send({ login: "sigin.test@gmail.com" })
      .expect(400, "Wrong password or username");

    request(app)
      .post("/signin")
      .set("content-type", "application/json")
      .send({ password: "123456789" })
      .expect(400, "Wrong password or username", done);
  });

  it("A inexisting user shouldn't be able to login", async done => {
    await AuthService.removeAccount("inexisting@gmail.com");

    request(app)
      .post("/signin")
      .set("content-type", "application/json")
      .send({ login: "inexisting@gmail.com", password: "123" })
      .expect(400, "Wrong password or username", done);
  });
});
