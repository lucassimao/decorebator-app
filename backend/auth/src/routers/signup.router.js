const express = require("express");
const AuthService = require("../services/auth.service");
const { config: { logger }, RepositoryException } = require("@lucassimao/decorabator-common");

const router = express.Router();

router.post("/signup", express.json(), async (req, res) => {
  const { login: email, password, name, country } = req.body;
  try {
    await AuthService.register(name, country, email, password);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    if (error instanceof RepositoryException && error.isValidationError){
      res.status(400).send(error.validationErrors)
    } else {
      res.status(500).send(error)
    }
  }
});

module.exports = router;
