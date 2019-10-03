const express = require("express");
const service = require("../services/image.service");
const { logger } = require("../config");

const router = express.Router({ mergeParams: true });
const wrapAsync = asyncMiddleware => {
  return (req, res, next) =>
    asyncMiddleware(req, res, next).catch(e => {
      logger.error(e);
      next(e);
    });
};

router
  .post(
    "/",
    express.json({ limit: "2MB" }),
    wrapAsync(async (req, res, next) => {
      const wordlist = await service.addImage(req.params.idWordlist, req.params.idWord, req.body, req.user);

      if (wordlist) {
        const word = wordlist.words.find(word => String(word._id) == req.params.idWord);
        const newImage = word.images[word.images.length - 1];

        res.set("Link", `${req.baseUrl}/${newImage._id}`);
        res.sendStatus(201);
      } else {
        next();
      }
    })
  )
  .patch(
    "/:idImage",
    express.json({ limit: "2MB" }),
    wrapAsync(async (req, res, next) => {
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
  )
  .delete(
    "/:idImage",
    wrapAsync(async (req, res, next) => {
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
    })
  );

module.exports = router;
