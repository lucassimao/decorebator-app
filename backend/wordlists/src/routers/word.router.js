const express = require("express");
const {default: wordService} = require("../services/word.service");

const router = express.Router({ mergeParams: true });
const wrapAsync = asyncMiddleware => {
  return (req, res, next) => asyncMiddleware(req, res, next).catch(next);
};

router
  .get(
    "/",
    wrapAsync(async (req, res, next) => {
      const { skip, limit } = req.query;
      const words = await wordService.getWords(
        req.params.idWordlist,
        req.user,
        parseInt(skip),
        parseInt(limit)
      );

      if (words && words.length > 0) {
        res.status(200).send(words);
      } else {
        next();
      }
    })
  )
  .get(
    "/:idWord([0-9]+)",
    wrapAsync(async (req, res, next) => {
      const object = await wordService.get(
        req.params.idWordlist,
        req.params.idWord,
        req.user
      );
      if (object) {
        res.status(200).send(object);
      } else {
        next();
      }
    })
  )
  .post(
    "/",
    express.json(),
    wrapAsync(async (req, res, next) => {
      const newWordId = await wordService.addWord(
        req.params.idWordlist,
        req.body,
        req.user
      );

      if (newWordId) {
        res.set("Link", `${req.baseUrl}/${newWordId}`);
        res.status(201).end();
      } else {
        next();
      }
    })
  )
  .patch(
    "/:idWord([0-9]+)",
    express.json(),
    wrapAsync(async (req, res, next) => {
      const status = await wordService.patchWord(
        req.params.idWordlist,
        req.params.idWord,
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
    "/:idWord([0-9]+)",
    wrapAsync(async (req, res, next) => {
      const status = await wordService.delete(
        req.params.idWordlist,
        req.params.idWord,
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
