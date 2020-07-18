const Router = require("express").Router;
const wordRouter = require("./word.router");
const wordlistRouter = require("./wordlist.router");
const imageRouter = require("./image.router");
const wordlistService = require("../services/wordlist.service");
const wordService = require("../services/word.service");

const { config: { logger } } = require('@lucassimao/decorabator-common')

const root = Router();


/**
 * This express midleware is only called in the situation in which the default
 * midleware is not able to successfull process the request 
 *
 */
const resolveStatus = async (req, res, next) => {
  const url = req.baseUrl + req.url;

  try {
    logger.warn(`Resolving status for ${url} ...`);

    const regex = /\/wordlists\/(\d+)(\/words\/(\d+)(\/images\/(\d+))?)?/;
    const [, idWordlist, , idWord, , idImage] = regex.exec(url);

    const wordlist = await wordlistService.get(idWordlist);

    if (!wordlist) {
      res.status(404).send("wordlist not found");
      return;
    }

    if (parseInt(wordlist.ownerId) != parseInt(req.user.id)) {
      res.sendStatus(403);
      return;
    }

    if (idWord) {
      const word = await wordService.getWithImages(idWordlist, idWord, req.user)
      if (!word) {
        res.status(404).send("word not found");
        return;
      }

      if (idImage) {
        const image = word.images?.find(img => parseInt(img.id) == idImage);
        if (!image) {
          res.status(404).send("image not found");
          return;
        }
      }
    }

    res.sendStatus(404);
  } catch (error) {
    logger.error(`Error while resolving ${url}`)
    next(error)
  }
};

root
  .use("/wordlists/:idWordlist/words/:idWord/images", imageRouter)
  .use("/wordlists/:idWordlist/words", wordRouter)
  .use("/wordlists", wordlistRouter)
  .use(resolveStatus);

module.exports = root;
