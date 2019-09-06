const express = require("express");
const service = require("../services/image.service");

const router = express.Router({ mergeParams: true });

router
  .all("*", (req, res, next) => {
    if (!req.params.idWordlist) throw "idWordlist is expected";
    if (!req.params.idWord) throw "idWord is expected";
    next();
  })
  .post("/", express.json(), async (req, res) => {
    const wordlist = await service.addImage(req.params.idWordlist, req.params.idWord, req.body);

    if (wordlist) {
      const word = wordlist.words.find(word => word._id == req.params.idWord);
      const newImage = word.images[word.images.length - 1];

      res.set("Link", `${req.baseUrl}/${newImage._id}`);
      res.status(201).send();
    } else {
      res.status(404).end();
    }
  })
  .patch("/:idImage", express.json(), async (req, res) => {
    const { nModified, ok } = await service.patchImage(
      req.params.idWordlist,
      req.params.idWord,
      req.params.idImage,
      req.body
    );

    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  })
  .delete("/:idImage", async (req, res) => {
    const { nModified, ok } = await service.deleteImage(
      req.params.idWordlist,
      req.params.idWord,
      req.params.idImage
    );

    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });

module.exports = router;
