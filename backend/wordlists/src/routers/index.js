const Router = require("express").Router;
const wordRouter = require("./word.router");
const wordlistRouter = require("./wordlist.router");
const imageRouter = require("./image.router");
const { logger } = require("../config");
const wordlistService = require("../services/wordlist.service");

const root = Router();

/**
 * This express midleware is only called in the situation in which the default
 * midleware is not able to successfull process the request
 *
 */
const resolveStatus = async (req, res) => {
  const regex = /\/wordlists\/(\w+)(\/words\/(\w+)(\/images\/(\w+))?)?/;
  const [, idWordlist, , idWord, , idImage] = regex.exec(req.baseUrl + req.url);

  const msg = `No suitable route for ${req.baseUrl + req.url} ... resolving status`;
  logger.warn(msg);

  const wordlist = await wordlistService.getWithWords(idWordlist);

  if (!wordlist) {
    res.status(404).send("wordlist not found");
    return;
  }

  if (String(wordlist.owner) != String(req.user._id)) {
    res.sendStatus(403);
    return;
  }

  if (idWord) {
    const word = wordlist.words.find(w => String(w._id) == String(idWord));
    if (!word) {
      res.status(404).send("word not found");
      return;
    }

    if (idImage) {
      const image = word.images.find(img => String(img._id) == idImage);
      if (!image) {
        res.status(404).send("image not found");
        return;
      }
    }
  }

  res.sendStatus(404);
};

root
  .use("/wordlists/:idWordlist/words/:idWord/images", imageRouter)
  .use("/wordlists/:idWordlist/words", wordRouter)
  .use("/wordlists", wordlistRouter)
  .use(resolveStatus);

module.exports = root;
