import { PubsubMessage } from "@google-cloud/pubsub/build/src/publisher";
import { Router } from "express";
import { newsCrawler } from "./news";
import { newsFanOut } from "./newsFanOut";
import {
  oxfordDictionaryCrawler
} from "./oxfordDictionary";
import { wordsApiCrawler } from "./wordsApi";
import { createHttpRequestLogger } from "../logger";
import { ALLOWED_LANGUAGES } from "../types/languageCode";
import WordService from "../services/word.service";


export const router = Router();
router.post('*', async (req, res, next) => {

  const logger = await createHttpRequestLogger(req);

  const pubSubMessage: PubsubMessage = req.body?.message;
  if (!pubSubMessage?.data) {
    res.sendStatus(204);
    return;
  }

  try {
    let buffer

    if (typeof pubSubMessage.data === 'string') {
      buffer = Buffer.from(pubSubMessage.data, "base64")
    } else {
      buffer = Buffer.from(pubSubMessage.data)
    }

    const payload = JSON.parse(buffer.toString());

    if (!ALLOWED_LANGUAGES.includes(payload?.languageCode)) {
      throw new Error("Invalid languageCode: " + payload.languageCode);
    }

    if (!(await WordService.exists(payload.id))) {
      res.sendStatus(204);
      logger.debug("Word was already deleted, skipping: " + JSON.stringify(payload));
      return
    }

    (<any>req).payload = payload;
    next()

  } catch (error) {
    res.sendStatus(204);
    logger.error("Error while parsing body", error);
    return;
  }

})
router.post("/words/oxforddictionaries", oxfordDictionaryCrawler);
router.post("/words/wordsApi", wordsApiCrawler);
router.post("/words/newsFanOut", newsFanOut);
router.post("/words/news", newsCrawler);
