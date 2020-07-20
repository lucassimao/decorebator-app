const express = require("express");
const service = require("../services/image.service");
const wordService = require("../services/word.service");

const router = express.Router({ mergeParams: true });
const wrapAsync = (asyncMiddleware) => (req, res, next) => asyncMiddleware(req, res, next).catch(next);

router
  .get('/', wrapAsync(async (req, res, next) => {
    const { idWordlist, idWord } = req.params;
    const word = await wordService.getWithImages(idWordlist, idWord, req.user)
    if (word) {
      res.status(200).send(word.images)
      return
    } else {
      next()
    }
  }))
  .post(
    "/",
    express.json({ limit: "2MB" }),
    wrapAsync(async (req, res, next) => {
      const newImage = await service.addImage(
        req.params.idWordlist,
        req.params.idWord,
        req.body,
        req.user
      );

      if (newImage) {
        res.set("Link", `${req.baseUrl}/${newImage.id}`);
        res.sendStatus(201);
      } else {
        next();
      }
    })
  )
  .patch(
    "/:idImage([0-9]+)",
    express.json({ limit: "2MB" }),
    wrapAsync(async (req, res, next) => {
      const status = await service.patchImage(
        req.params.idWordlist,
        req.params.idWord,
        req.params.idImage,
        req.body,
        req.user
      );

      if (status) {
        res.sendStatus(204);
      } else {
        next();
      }
    })
  )
  .delete(
    "/:idImage([0-9]+)",
    wrapAsync(async (req, res, next) => {
      const status = await service.deleteImage(
        req.params.idWordlist,
        req.params.idWord,
        req.params.idImage,
        req.user
      );

      if (status) {
        res.sendStatus(204);
      } else {
        next();
      }
    })
  );

module.exports = router;
