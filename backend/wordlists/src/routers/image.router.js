const express = require("express");
const service = require("../services/image.service");

const router = express.Router({ mergeParams: true });

router
  .all("*", async (req, res, next) => {
    const { idWordlist, idWord } = req.params;

    if (!idWordlist) throw "idWordlist is expected";
    if (!idWord) throw "idWord is expected";

    next();
  })
  .post("/", express.json(), async (req, res, next) => {
    const wordlist = await service.addImage(req.params.idWordlist, req.params.idWord, req.body, req.user);

    if (wordlist) {
      const word = wordlist.words.find(word => word._id == req.params.idWord);
      const newImage = word.images[word.images.length - 1];

      res.set("Link", `${req.baseUrl}/${newImage._id}`);
      res.sendStatus(201);
    } else {
      next();
    }
  })
  .patch("/:idImage", express.json(), async (req, res, next) => {
    const { nModified, ok } = await service.patchImage(
      req.params.idWordlist,
      req.params.idWord,
      req.params.idImage,
      req.body,
      req.user
    );

    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      next();
    }
  })
  .delete("/:idImage", async (req, res, next) => {
    const object = ({ nModified, ok } = await service.deleteImage(
      req.params.idWordlist,
      req.params.idWord,
      req.params.idImage,
      req.user
    ));

    if (nModified === 1 && ok === 1) {
      res.sendStatus(204);
    } else {
      next();
    }
  });

module.exports = router;
