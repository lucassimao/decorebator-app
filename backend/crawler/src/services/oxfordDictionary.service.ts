import { PubSub } from "@google-cloud/pubsub";
import axios, { AxiosRequestConfig } from "axios";
import moment from "moment";
import winston from "winston";
import Lemma from "../entities/lemma";
import Pronunciation from "../entities/Pronunciation";
import Sense from "../entities/sense";
import SenseDetail from "../entities/senseDetail";
import SenseDetailType from "../entities/senseDetailType";
import defaultLogger from "../logger";
import LemmaService from "../services/lemma.service";
import { LanguageCode } from "../types/languageCode";
import { Lemmatron } from "../types/lemmatron";
import { RetrieveEntry } from "../types/retrieveEntry";
import { WordDTO } from "../types/word.dto";

const appId = process.env.OXFORD_DICTIONARIES_APP_ID;
if (!appId) {
  throw new Error("OXFORD_DICTIONARIES_APP_ID is required");
}
const appKey = process.env.OXFORD_DICTIONARIES_APP_KEY;
if (!appKey) {
  throw new Error("OXFORD_DICTIONARIES_APP_KEY is required");
}

const topic: string = process.env.PUB_SUB_WORDS_TOPIC ?? "";
if (!topic) {
  throw new Error("PUB_SUB_WORDS_TOPIC is required");
}

const axiosConfig: AxiosRequestConfig = {
  baseURL: "https://od-api.oxforddictionaries.com",
  headers: {
    app_id: appId,
    app_key: appKey,
  },
};

const pubSubClient = new PubSub();

function __notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

async function __findLemmaOrSaveAsOutdated(
  name: string,
  language: string,
  provider: string,
  customLogger?: winston.Logger
): Promise<Lemma | null> {
  const logger = customLogger ?? defaultLogger;
  let lemma = await LemmaService.findOneBy({ name, language, provider });
  if (!lemma && language.includes("-")) {
    lemma = await LemmaService.findOneBy({
      name,
      language: language.split("-")[0],
      provider,
    });
  }
  if (lemma) {
    return lemma;
  }

  // const word: WordDTO = { languageCode: language as LanguageCode, name }
  // const dataBuffer = Buffer.from(JSON.stringify(word));
  // const tag = `${name}(${language})`;

  try {
    // logger.debug(`[${tag}] publishing to Pub/Sub ...`)
    // await pubSubClient.topic(topic).publish(dataBuffer);

    // it creates a new lemma, but saves it as 'outdated' to force a refresh when the word comes from pubsub
    return LemmaService.save({
      updatedAt: moment().subtract(100, "days").toDate(),
      provider,
      name,
      language,
      lexicalCategory: "unknow",
    });
  } catch (error) {
    logger.error(error, { name, language, provider });
    return null;
  }
}

const OxfordDictionaryService = {
  async searchEntry(
    word: string,
    languageCode: LanguageCode
  ): Promise<RetrieveEntry | undefined> {
    try {
      const path = `/api/v2/entries/${languageCode}/${encodeURIComponent(
        word
      )}`;
      const response = await axios.get(path, axiosConfig);
      const retrieveEntry: RetrieveEntry = response.data;
      return retrieveEntry;
    } catch (error) {
      if (error.isAxiosError && error.response) {
        const {
          response: { data, status },
        } = error;
        if (status === 404 && data.error.startsWith("No entry found")) {
          return;
        }
      }
      throw error;
    }
  },

  async searchLemma(
    word: string,
    languageCode: LanguageCode
  ): Promise<Lemmatron> {
    const path = `/api/v2/lemmas/${languageCode}/` + encodeURIComponent(word);
    const response = await axios.get(path, axiosConfig);
    const lemmatron: Lemmatron = response.data;
    return lemmatron;
  },

  async pushPlaceholdersToPubSub(customLogger?: winston.Logger): Promise<void> {
    const logger = customLogger ?? defaultLogger;

    const placeholders = await LemmaService.getPlaceholders();
    for (const placeholder of placeholders) {
      if (!placeholder.name) continue;

      const word: WordDTO = {
        languageCode: placeholder.language as LanguageCode,
        name: placeholder.name,
      };
      const dataBuffer = Buffer.from(JSON.stringify(word));
      const tag = `${word.name}(${word.languageCode})`;

      logger.debug(`[${tag}] publishing placeholder to Pub/Sub ...`);
      await pubSubClient.topic(topic).publish(dataBuffer);
    }
  },
  async mapRetrieveEntryToLemmas(
    searchEntryResponse: RetrieveEntry,
    word: WordDTO,
    customLogger?: winston.Logger
  ): Promise<Lemma[]> {
    const provider = searchEntryResponse.metadata.provider as string;
    const tag = `${word.name}(${word.languageCode})`;
    const logger = customLogger ?? defaultLogger;
    const lemmata: Lemma[] = [];

    logger.debug(
      `[${tag}] found ${searchEntryResponse.results?.length ?? 0} results ...`
    );

    for (const headwordEntry of searchEntryResponse.results) {
      logger.debug(
        `[${tag}] found ${
          headwordEntry.lexicalEntries?.length ?? 0
        } lexical entries ...`
      );

      for (const lexicalEntry of headwordEntry.lexicalEntries) {
        const {
          text: name,
          language,
          lexicalCategory: { id: lexicalCategory },
        } = lexicalEntry;

        let existingLemma = await LemmaService.findOneBy({
          name,
          language,
          lexicalCategory,
        });
        if (!existingLemma) {
          existingLemma = await LemmaService.findOneBy({
            name,
            lexicalCategory: "unknow",
          });
        }

        const senses: Sense[] = [];
        const pronunciations: Pronunciation[] = [];
        const phrases = lexicalEntry.phrases?.map((phrase) => phrase.text);
        const phrasalVerbs: Lemma[] = [];

        for (const phrasalVerb of lexicalEntry.phrasalVerbs ?? []) {
          if (phrasalVerb.text === lexicalEntry.text) continue;

          const lemma = await __findLemmaOrSaveAsOutdated(
            phrasalVerb.text,
            language,
            provider,
            logger
          );
          if (lemma) {
            phrasalVerbs.push(lemma);
          }
        }

        logger.debug(`[${tag}] found ${phrasalVerbs.length} phrasal verbs ...`);

        // logger.debug(`[${tag}] found ${lexicalEntry.entries?.length ?? 0} entries ...`);
        for (const entry of lexicalEntry.entries ?? []) {
          logger.debug(
            `[${tag}] found ${
              entry.pronunciations?.length ?? 0
            } pronunciations ...`
          );

          entry.pronunciations?.forEach((pronunciation) =>
            pronunciations.push({
              audioFile: pronunciation.audioFile,
              dialects: pronunciation.dialects,
              phoneticNotation: pronunciation.phoneticNotation,
              phoneticSpelling: pronunciation.phoneticSpelling,
            })
          ) ?? [];

          logger.debug(
            `[${tag}] found ${entry.senses?.length ?? 0} senses ...`
          );

          for (const sense of entry.senses ?? []) {
            const definitions = new Set([
              ...(sense.definitions ?? []),
              ...(sense.shortDefinitions ?? []),
            ]);

            if (!definitions?.size) {
              continue;
            }

            const synonyms: Lemma[] = [];
            const senseDetails: SenseDetail[] = [];

            sense.examples?.forEach((example) => {
              senseDetails.push({
                detail: example.text,
                type: SenseDetailType.EXAMPLE,
              });
            });

            definitions.forEach((definition) => {
              senseDetails.push({
                detail: definition,
                type: SenseDetailType.DEFINITION,
              });
            });

            for (const synonym of sense.synonyms ?? []) {
              if (
                synonym.text === lexicalEntry.text ||
                synonyms.find((s) => s.name === synonym.text)
              )
                continue;
              const lemma = await __findLemmaOrSaveAsOutdated(
                synonym.text,
                language,
                provider,
                logger
              );
              if (lemma) {
                synonyms.push(lemma);
              }
            }

            logger.debug(`[${tag}] found ${synonyms.length} synonyms ...`);

            let antonyms: Lemma[] = [];
            if (sense.antonyms?.length) {
              const results = await Promise.all(
                sense.antonyms.map((antonym) =>
                  __findLemmaOrSaveAsOutdated(
                    antonym.text,
                    language,
                    provider,
                    logger
                  )
                )
              );
              antonyms = results.filter(__notEmpty);
            }

            logger.debug(`[${tag}] found ${antonyms.length} antonyms ...`);
            senses.push({ details: senseDetails, synonyms, antonyms });
          }
        }

        // plural?

        const lemma = await LemmaService.save({
          ...existingLemma,
          phrases: [...(existingLemma?.phrases ?? []), ...(phrases ?? [])],
          name: lexicalEntry.text,
          language: lexicalEntry.language,
          lexicalCategory: lexicalEntry.lexicalCategory.id,
          provider: searchEntryResponse.metadata.provider as string,
          pronunciations,
          senses,
          phrasalVerbs,
        });
        if (!lemmata.find((item) => item.id === lemma.id)) {
          lemmata.push(lemma);
        }
        logger.debug(`[${tag}] lemma saved`);
      }
    }

    return lemmata;
  },
};
export default OxfordDictionaryService;
