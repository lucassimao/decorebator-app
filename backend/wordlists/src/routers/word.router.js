const express = require("express");
const wordService = require("../services/word.service");

const router = express.Router({ mergeParams: true });
const wrapAsync = asyncMiddleware => {
  return (req, res, next) => asyncMiddleware(req, res, next).catch(next);
};

router
  .get("/", wrapAsync(async (req, res, next) => {
    const { page, pageSize } = req.query;
    const object = await wordService.getWords(req.params.idWordlist, req.user, page, pageSize);

    if (object) {
      res.status(200).send(object);
    } else {
      next();
    }
  }))
  .get("/:idWord", wrapAsync(async (req, res, next) => {
    const object = await wordService.get(req.params.idWordlist, req.params.idWord, req.user);
    if (object) {
      res.status(200).send(object);
    } else {
      next();
    }
  }))
  .post("/", express.json(), wrapAsync(async (req, res, next) => {
    const object = await wordService.addWord(req.params.idWordlist, req.body, req.user);

    if (object) {
      const word = object.words[object.words.length - 1];
      res.set("Link", `${req.baseUrl}/${word._id}`);
      res.status(201).end();
    } else {
      next();
    }
  }))
  .patch("/:idWord", express.json(), wrapAsync(async (req, res, next) => {
    const { n, nModified, ok } = await wordService.patchWord(
      req.params.idWordlist,
      req.params.idWord,
      req.body,
      req.user
    );

    if (n === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      next();
    }
  }))
  .delete("/:idWord", wrapAsync(async (req, res, next) => {
    const { nModified, ok } = await wordService.delete(req.params.idWordlist, req.params.idWord, req.user);
    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      next();
    }
  }));

module.exports = router;
