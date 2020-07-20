const express = require("express");
const service = require("../services/wordlist.service");
const { config: {logger},RepositoryException } = require('@lucassimao/decorabator-common')

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
      logger.debug(wordlist);
      
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
      try {
        const wordlist = await service.save(req.body, req.user);
        res.set("Link", `/wordlists/${wordlist.id}`);
        res.status(201).end();
      } catch (error) {
        if (error instanceof RepositoryException && error.isValidationError) {
          logger.error(error)
          res.status(400).send(error.validationErrors);
        } else {
          throw error;
        }
      }
    })
  )
  .delete(
    "/:id",
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
    "/:id",
    express.json(),
    wrapAsync(async (req, res, next) => {
      const success = await service.update(
        req.params.id,
        req.body,
        req.user
      );

      if (success) {
        res.set("Link", `/wordlists/${req.params.id}`);
        res.status(204).end();
      } else {
        next();
      }
    })
  );

module.exports = router;
