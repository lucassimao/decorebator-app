const express = require("express");
const {default:service} = require("../services/wordlist.service");
const router = express.Router();
const { createHttpRequestLogger } = require("../logger");

const wrapAsync = asyncMiddleware => {
  return (req, res, next) =>
    asyncMiddleware(req, res, next).catch(async error => {
      const logger = await createHttpRequestLogger(req);
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
    "/:id([0-9]+)",
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
    express.json({ limit: 2 * 1024 * 1024 }), // //TODO<backend> buffer size should be bigger for paying users
    wrapAsync(async (req, res) => {
      const wordlist = await service.save(req.body, req.user);
      res.set("Link", `/wordlists/${wordlist.id}`);
      res.status(201).end();
      // const logger = await createHttpRequestLogger(req);
      // logger.error(error)
      // res.status(400).send(error.validationErrors);
    })
  )
  .delete(
    "/:id([0-9]+)",
    wrapAsync(async (req, res, next) => {
      const success = await service.delete(req.params.id, req.user);
      if (success) {
        res.status(204).end();
      } else {
        next();
      }
    })
  )
  .patch(
    "/:id([0-9]+)",
    express.json(),
    wrapAsync(async (req, res, next) => {
      const success = await service.update(req.params.id, req.body, req.user);

      if (success) {
        res.set("Link", `/wordlists/${req.params.id}`);
        res.status(204).end();
      } else {
        next();
      }
    })
  );

module.exports = router;
