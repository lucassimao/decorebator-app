import { Request, Response } from "express";
import { Like } from "typeorm";
import { createHttpRequestLogger } from "../logger";
import LemmaService from "../services/lemma.service";
import WordService from "../services/word.service";
import WordApiService, { PROVIDER } from "../services/wordApi.service";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";

export const wordsApiCrawler = async (
  req: Request,
  response: Response
): Promise<void> => {
  const logger = await createHttpRequestLogger(req);
  const pubSubMessage: PubSubMessage = req.body?.message;

  if (!pubSubMessage) {
    response.sendStatus(204);
    return;
  }

  let word: WordDTO;
  try {
    word = JSON.parse(Buffer.from(pubSubMessage.data, "base64").toString());
    word = { ...word, name: word.name.toLowerCase() };
  } catch (error) {
    logger.error("Error while decoding body", error);
    response.sendStatus(204);
    return;
  }

  if (!(await WordService.exists(word.id))) {
    response.sendStatus(204);
    return
  }

  if (
    !["en", "en-us", "en-uk"].includes(word.languageCode.toLocaleLowerCase())
  ) {
    throw new Error(`Invalid languageCode ${word.languageCode}`);
  }

  const existingLemmas = await LemmaService.findAllBy({
    provider: PROVIDER,
    name: word.name,
    language: Like(`${word.languageCode}%`),
  });
  const isRefreshRequired =
    !existingLemmas?.length ||
    existingLemmas.some((lemma) => lemma.isRefreshRequired());

  try {
    if (isRefreshRequired) {
      const sevice = new WordApiService(logger);
      const result = await sevice.search(word.name, "en");
      if (result?.results?.length) {
        await sevice.mapResultToLemmas(word, result);
      } else {
        logger.debug(`No results for ${word.name}  ...`, { word });
      }
    } else {
      logger.debug(`No refresh required  ...`, { word });
    }

    response.sendStatus(200);
  } catch (error) {
    logger.error("Error while processing word", error);
    response.sendStatus(500);
  }
};
