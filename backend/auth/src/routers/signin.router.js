const express = require("express");
const AuthService = require("../services/auth.service");
const { config: { logger } } = require("@lucassimao/decorabator-common");

const router = express.Router();

router.post("/signin", express.json(), async (req, res) => {
  const { login, password } = req.body;
  try {
    const jwtToken = await AuthService.doLogin(login, password);
    res.set("authorization", jwtToken);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    if (typeof error == "string") {
      res.status(400).send("Wrong password or username");
    } else {
      res.status(500).send(error)
    }
  }
});

module.exports = router;
