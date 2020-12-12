const express = require("express");
const AuthService = require("../services/auth.service");

const router = express.Router();

router.post("/signup", express.json(), async (req, res) => {
  const { login: email, password, name, country } = req.body;
  await AuthService.register(name, country, email, password);
  res.sendStatus(200);
});

module.exports = router;
