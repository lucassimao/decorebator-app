import axios, { AxiosRequestConfig } from "axios";
import { getConnection, Like } from "typeorm";
import winston from "winston";
import Lemma from "../entities/lemma";
import Sense from "../entities/sense";
import SenseDetailType from "../entities/senseDetailType";
import defaultLogger from "../logger";
import { LanguageCode } from "../types/languageCode";
import { WordDTO } from "../types/word.dto";
import { SuccessfulReponse } from "../types/wordApiResponse";
import moment from "moment";
import LemmaService from "./lemma.service";

const apiKey = process.env.WORDS_API_KEY;
if (!apiKey) {
  throw new Error("WORDS_API_KEY is required");
}

const apiHost: string = process.env.WORDS_API_HOST ?? "";
if (!apiHost) {
  throw new Error("WORDS_API_HOST is required");
}

const axiosConfig: AxiosRequestConfig = {
  baseURL: "https://wordsapiv1.p.rapidapi.com/words",
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiHost,
    useQueryString: true,
  },
};

export const PROVIDER = "wordsApi";

export default class WordApiService {
  private logger: winston.Logger;

  constructor(logger?: winston.Logger) {
    this.logger = logger ?? defaultLogger;
  }

  async mapResultToLemmas(
    word: WordDTO,
    response: SuccessfulReponse
  ): Promise<boolean> {
    const name = word.name.toLowerCase();

    return await getConnection().transaction(async (entityManager) => {
      const lemmaRepository = entityManager.getRepository(Lemma);
      const { languageCode: language } = word;
      const tag = `${name}(${language}) - ${PROVIDER}`;

      this.logger.debug(
        `[${tag}] Processing ${response.results.length} result(s)`
      );

      for (const result of response.results) {
        const sense = new Sense();
        const lexicalCategory = result.partOfSpeech;
        sense.lemma = await lemmaRepository.findOne({
          name,
          language: Like(`${language}%`),
          lexicalCategory,
        });

        if (!sense.lemma?.id) {
          this.logger.debug(`[${tag}] Creating new lemma`);
          sense.lemma = await lemmaRepository.save({
            name,
            language,
            provider: PROVIDER,
            lexicalCategory: result.partOfSpeech,
          });
        } else {
          await lemmaRepository.update(sense.lemma.id, {
            updatedAt: new Date(),
          });
          this.logger.debug(`[${tag}] Lemma found`);
        }

        const details = [
          { detail: result.definition, type: SenseDetailType.DEFINITION },
        ];
        for (const example of result.examples ?? []) {
          details.push({ detail: example, type: SenseDetailType.EXAMPLE });
        }

        const { id: senseId } = await entityManager
          .getRepository(Sense)
          .save({ ...sense, details });

        this.logger.debug(
          `[${tag}] Processing ${result.synonyms?.length ?? 0} synonyms`
        );

        for (const synonym of result.synonyms ?? []) {
          let lemma = await lemmaRepository.findOne({
            name: synonym,
            language: Like(`${language}%`),
            lexicalCategory,
          });
          if (!lemma) {
            lemma = await lemmaRepository.save({
              provider: PROVIDER,
              updatedAt: moment().subtract(100, "days").toDate(),
              language,
              name: synonym,
              lexicalCategory,
            });
          }
          await entityManager.query(
            "insert into sense_synonyms_lemma(sense_id,lemma_id) values ($1,$2)  ON CONFLICT DO NOTHING",
            [senseId, lemma.id]
          );
        }

        this.logger.debug(
          `[${tag}] Processing ${result.antonyms?.length ?? 0} antonyms`
        );

        for (const antonym of result.antonyms ?? []) {
          let lemma = await lemmaRepository.findOne({
            name: antonym,
            lexicalCategory,
            language: Like(`${language}%`),
          });
          if (!lemma) {
            lemma = await lemmaRepository.save({
              provider: PROVIDER,
              language,
              updatedAt: moment().subtract(100, "days").toDate(),
              name: antonym,
              lexicalCategory,
            });
          }

          await entityManager.query(
            "insert into sense_antonyms_lemma(sense_id,lemma_id) values ($1,$2)  ON CONFLICT DO NOTHING",
            [senseId, lemma.id]
          );
        }

        if (word.id) {
          // since RelationQueryBuilder doesn't support on conflict yet
          await entityManager.query(
            "insert into word_lemmas_lemma(word_id,lemma_id) values ($1,$2)  ON CONFLICT DO NOTHING",
            [word.id, sense.lemma.id]
          );
        }

        this.logger.debug(`[${tag}] Sense saved`);
      }

      return true;
    });
  }

  async search(
    word: string,
    language: LanguageCode
  ): Promise<SuccessfulReponse | undefined> {
    const tag = `${word}(${language})`;

    try {
      const response = await axios(encodeURIComponent(word), axiosConfig);
      const body: SuccessfulReponse = await response.data;
      return body;
    } catch (error) {
      if (error.isAxiosError) {
        if (error.response) {
          const {
            response: { data, status, headers },
          } = error;
          this.logger.debug(
            `[${tag}] Request made and server responded with error ...`,
            { data, status, headers }
          );
          if (data.message === "word not found") {
            return;
          }
        } else if (error.request) {
          this.logger.error(
            `[${tag}] request was made but no response was received ...`,
            { request: error.request }
          );
        } else {
          this.logger.error(
            `[${tag}] Something happened in setting up the request that triggered an Error ...`,
            { message: error.message }
          );
        }
      } else {
        this.logger.error(error);
      }
      throw error;
    }
  }
}
