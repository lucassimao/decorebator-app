import { Request, Response } from "express";
import { Like } from "typeorm";
import { createHttpRequestLogger } from "../logger";
import LemmaService from "../services/lemma.service";
import OxfordDictionaryService from "../services/oxfordDictionary.service";
import WordService from "../services/word.service";
import { LanguageCode } from "../types/languageCode";
import { WordDTO } from "../types/word.dto";

const ENTRY_SUPPORTED_LANGUAGES = [LanguageCode.EN, LanguageCode.FR, LanguageCode.ES]


export const oxfordDictionaryCrawler = async (
  req: Request,
  response: Response
): Promise<void> => {
  const logger = await createHttpRequestLogger(req);

  let word: WordDTO = (<any>req).payload;
  word = { ...word, name: word.name.toLowerCase() };

  const tag = `${word.name}(${word.languageCode})`;

  if (!ENTRY_SUPPORTED_LANGUAGES.includes(word.languageCode)) {
    logger.debug(`[${tag}] Language isn't supported by oxford entries API  ...`);
    response.sendStatus(200);
    return
  }


  let existingLemmas = await LemmaService.findAllBy({
    name: word.name,
    language: Like(`${word.languageCode}%`),
  });
  const isRefreshRequired =
    !existingLemmas?.length ||
    existingLemmas.some((lemma) => lemma.isRefreshRequired());

  try {
    if (isRefreshRequired) {
      logger.debug(`[${tag}] Starting refresh  ...`);

      const searchEntryResponse = await OxfordDictionaryService.searchEntry(
        word.name,
        word.languageCode
      );
      if (searchEntryResponse) {
        logger.debug(
          `[${tag}] found ${searchEntryResponse.results?.length ?? 0
          } head word entries ...`
        );
        existingLemmas = await OxfordDictionaryService.mapRetrieveEntryToLemmas(
          searchEntryResponse,
          word,
          logger
        );
      } else {
        logger.debug(`[${tag}] no entry, searching lemma ...`);
        const lemmatron = await OxfordDictionaryService.searchLemma(
          word.name,
          word.languageCode
        );

        const lemmas = lemmatron.results
          .flatMap(({ lexicalEntries }) => lexicalEntries)
          .flatMap(({ inflectionOf }) => inflectionOf)
          .map(({ id }) => id);

        logger.debug(`Found ${lemmas?.length || 0} lemmas`)

        for (const lemma of lemmas) {
          logger.debug(lemma)
          const searchEntryResponse = await OxfordDictionaryService.searchEntry(
            lemma,
            word.languageCode
          );
          if (!searchEntryResponse) continue;
          const result = await OxfordDictionaryService.mapRetrieveEntryToLemmas(
            searchEntryResponse,
            word,
            logger
          );
          existingLemmas = [...result, ...existingLemmas];
        }
      }
    } else {
      logger.debug(`[${tag}] No refresh required  ...`);
    }

    if (word.id) {
      await WordService.updateWordLemmas(word.id, existingLemmas);
    }

    response.sendStatus(200);
  } catch (error) {
    if (!error.isAxiosError) {
      logger.error(error);
      response.sendStatus(500);
      return
    }

    let responseStatus = 500;
    if (error.response) {
      const {
        response: { data, status, headers },
      } = error;
      logger.debug(
        `[${tag}] Request made and server responded with error ...`,
        { data, status, headers }
      );
      // word not found in oxford dict
      if (status === 404) responseStatus = 200;

    } else if (error.request) {
      logger.error(
        `[${tag}] request was made but no response was received ...`,
        { request: error.request }
      );
    } else {
      logger.error(
        `[${tag}] Something happened in setting up the request that triggered an Error ...`,
        { message: error.message }
      );
    }

    response.sendStatus(responseStatus);
    return;
  }
};
