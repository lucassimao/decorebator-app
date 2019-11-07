const express = require("express");
const service = require("../services/wordlist.service");
const { logger } = require("../config");

const router = express.Router();

const wrapAsync = asyncMiddleware => {
  return (req, res, next) =>
    asyncMiddleware(req, res, next).catch(error => {
      logger.error(error);
      next(error);
    });
};

router
  .get(
    "/public",
    wrapAsync(async (req, res) => {
      const user = req.user;
      const { page = 0, filter } = req.query;

      const wordlists = await service.listPublic({ page, filter }, user);
      res.status(200).send({ wordlists });
    })
  )
  .get(
    "/",
    wrapAsync(async (req, res) => {
      const user = req.user;
      const { page = 0, filter } = req.query;

      const wordlists = await service.list({ page, filter }, user);
      res.status(200).send({ wordlists });
    })
  )
  .get(
    "/:id",
    wrapAsync(async (req, res, next) => {
      const wordlist = await service.get(req.params.id, req.user);

      if (wordlist) {
        res.status(200).send(wordlist);
      } else {
        next();
      }
    })
  )
  .post(
    "/",
    express.json(),
    wrapAsync(async (req, res) => {
      try {
        let wordlist = req.body;
        wordlist = await service.save(wordlist, req.user);
        res.set("Link", `/wordlists/${wordlist._id}`);
        res.status(201).end();
      } catch (error) {
        if (error.name == "ValidationError") {
          logger.error(error);
          res.status(400).send(error.errors);
        } else {
          throw error;
        }
      }
    })
  )
  .delete(
    "/:id",
    wrapAsync(async (req, res, next) => {
      const dbResponse = await service.delete(req.params.id, req.user);

      if (dbResponse.ok === 1 && dbResponse.deletedCount === 1) {
        res.status(204).end();
      } else {
        next();
      }
    })
  )
  .patch(
    "/:id",
    express.json(),
    wrapAsync(async (req, res, next) => {
      const updateResult = await service.update(req.params.id, req.body, req.user);

      if (updateResult.ok === 1 && updateResult.nModified === 1) {
        res.set("Link", `/wordlists/${req.params.id}`);
        res.status(204).end();
      } else {
        next();
      }
    })
  );

module.exports = router;
