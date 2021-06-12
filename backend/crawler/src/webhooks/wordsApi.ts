import { Request, Response } from "express";
import { Like } from "typeorm";
import { createHttpRequestLogger } from "../logger";
import LemmaService from "../services/lemma.service";
import WordApiService, { PROVIDER } from "../services/wordApi.service";
import { LanguageCode } from "../types/languageCode";
import { WordDTO } from "../types/word.dto";

export const wordsApiCrawler = async (
  req: Request,
  response: Response
): Promise<void> => {
  const logger = await createHttpRequestLogger(req);

  let word: WordDTO = (<any>req).payload;

  // wordsApi only supports english
  if (word.languageCode !== LanguageCode.EN) {
    response.sendStatus(204);
    return;
  }

  word = { ...word, name: word.name.toLowerCase() };

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
      const result = await sevice.search(word.name);
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
