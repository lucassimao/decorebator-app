const express = require("express");
const AuthService = require("../services/auth.service");

const router = express.Router();

router.post("/signin", express.json(), async (req, res, next) => {
  const { login, password } = req.body;
  try {
    const jwtToken = await AuthService.doLogin(login, password);
    res.set("authorization", jwtToken);
    res.sendStatus(200);
  } catch (error) {
    if (typeof error == "string") {
      res.status(400).send("Wrong password or username");
      // TODO log detailed information about the error
    } else next(error);
  }
});

module.exports = router;
