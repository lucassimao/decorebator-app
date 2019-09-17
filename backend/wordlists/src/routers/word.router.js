const express = require("express");
const wordService = require("../services/word.service");

const router = express.Router({ mergeParams: true });

router
  .get("/", async (req, res, next) => {
    const object = await wordService.getAll(req.params.idWordlist, req.user);
    if (object) {
      res.status(200).send(object);
    } else {
      next();
    }
  })
  .get("/:idWord", async (req, res, next) => {
    const object = await wordService.get(req.params.idWordlist, req.params.idWord, req.user);
    if (object) {
      res.status(200).send(object);
    } else {
      next();
    }
  })
  .post("/", express.json(), async (req, res, next) => {
    const object = await wordService.addWord(req.params.idWordlist, req.body, req.user);

    if (object) {
      res.set("Link", `/${req.baseUrl}/${object._id}`);
      res.status(201).end();
    } else {
      next();

    }
  })
  .patch("/:idWord", express.json(), async (req, res, next) => {
    const { nModified, ok } = await wordService.patchWord(
      req.params.idWordlist,
      req.params.idWord,
      req.body,
      req.user
    );

    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      next();
    }
  })
  .delete("/:idWord", async (req, res, next) => {
    const { nModified, ok } = await wordService.delete(req.params.idWordlist, req.params.idWord, req.user);
    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      next();
    }
  });

module.exports = router;
