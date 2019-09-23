const express = require("express");
const AuthService = require("../services/auth.service");

const router = express.Router();

router.post("/signup", express.json(), async (req, res, next) => {
  const { login: email, password, name, country } = req.body;
  try {
    await AuthService.register(name, country, email, password);
    res.sendStatus(200);
  } catch (error) {
    switch (error.name) {
      case "MongoError":
        if (error.code === 11000 && "email" in error.keyPattern) res.status(400).send("User already exists");
        break;
      case "ValidationError":
        res.status(400);

        if ("country" in error.errors) res.send("Invalid country");
        else if ("email" in error.errors) res.send(error.errors.email.message);
        else res.send(error.message);
        break;
      default:
        console.error(error);
        next(error);
    }
  }
});

module.exports = router;
