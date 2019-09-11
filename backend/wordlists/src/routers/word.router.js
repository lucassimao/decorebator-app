const express = require("express");
const wordService = require("../services/word.service");

const router = express.Router({ mergeParams: true });

router
  .all("*", (req, res, next) => {
    if (req.params.idWordlist) next();
    else throw "idWordlist is expected";
  })
  .get("/", async (req, res) => {
    const object = await wordService.getAll(req.params.idWordlist,req.user);
    if (object) {
      res.status(200).send(object);
    } else {
      res.sendStatus(404);
    }
  })  
  .get("/:idWord", async (req, res) => {
    const object = await wordService.get(req.params.idWordlist,req.params.idWord,req.user);
    if (object) {
      res.status(200).send(object);
    } else {
      res.sendStatus(404);
    }
  })
  .post("/", express.json(), async (req, res) => {
    const object = await wordService.addWord(req.params.idWordlist, req.body,req.user);

    if (object) {
      res.set("Link", `/${req.baseUrl}/${object._id}`);
      res.status(201).end();
    } else {
      res.status(404).end();
    }
  })
  .patch("/:idWord", express.json(), async (req, res) => {
    const { nModified, ok } = await wordService.patchWord(req.params.idWordlist, req.params.idWord, req.body,req.user);

    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  })
  .delete("/:idWord", async (req, res) => {
    const { nModified, ok } = await wordService.delete(req.params.idWordlist, req.params.idWord,req.user);
    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });

module.exports = router;
