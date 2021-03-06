import { getRepository, In } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import QuizzWithOptions from "../dtos/quizzWithOptions";
import Lemma from "../entities/lemma";
import Quizz from "../entities/quizz";
import QuizzType from "../entities/quizzType";
import SenseDetailType from "../entities/senseDetailType";
import logger from "../logger";
import LemmaService from "./lemma.service";
import FillSentenceQuizzService from "./strategies/fillSentenceQuizz.service";
import MeaningFromWordQuizzService from "./strategies/meaningFromWordQuizz.service";
import WordFromMeaningQuizzService from "./strategies/wordFromMeaningQuizz.service";
import WordService from "./word.service";

export const OPTIONS_LENGTH = 4;

export default class QuizzService {
  static async registerGuess(quizzId: number, success: boolean): Promise<void> {
    const quizzRepository = getRepository(Quizz);
    const payload: QueryDeepPartialEntity<Quizz> = {
      totalGuesses: () => "total_guesses+1",
    };
    if (success) {
      payload.hits = () => "hits+1";
    }
    await quizzRepository.update(quizzId, payload);
  }

  static async loadOrCreateQuizz(
    ownerId: number,
    quizzType: QuizzType,
    wordlistId?: number
  ): Promise<Quizz> {
    let word = await WordService.getNextWordForQuizz(
      ownerId,
      quizzType,
      wordlistId
    );

    let quizz = null;
    let sense = null;

    if (word?.id) {
      if (!word?.lemmas?.length) throw new Error("no lemmas!");
      const lemma = word?.lemmas[0];

      if (!lemma?.senses?.length) throw new Error("no senses!");
      sense = lemma.senses[0];

      if (!sense?.id) {
        throw new Error("invalid sense");
      }

      quizz = await QuizzService.registerNew(
        word.id,
        ownerId,
        quizzType,
        sense.id
      );
    } else {
      quizz = await QuizzService.getLeastRecentlyTried(
        ownerId,
        quizzType,
        wordlistId
      );
      if (!quizz) {
        throw new Error("No word or quizz available");
      }
      word = quizz.word;
      sense = quizz.sense;
      await QuizzService.refreshUpdatedAt(Number(quizz.id));
    }

    return { ...quizz, word, sense };
  }

  static async registerNew(
    wordId: number,
    ownerId: number,
    type: QuizzType,
    senseId?: number
  ): Promise<Quizz> {
    const quizzRepository = getRepository(Quizz);
    return quizzRepository.save({
      ownerId,
      type,
      senseId,
      wordId,
      hits: 0,
      totalGuesses: 0,
    });
  }

  static async refreshUpdatedAt(quizzId: number): Promise<void> {
    const quizzRepository = getRepository(Quizz);
    await quizzRepository.update(quizzId, {});
  }

  static async getLeastRecentlyTried(
    ownerId: number,
    quizzType: QuizzType,
    wordlistId?: number
  ): Promise<Quizz | undefined> {
    const quizzRepository = getRepository(Quizz);

    const queryBuilder = await quizzRepository
      .createQueryBuilder("quizz")
      .innerJoinAndSelect("quizz.word", "word")
      .innerJoin("word.wordlist", "wordlist")
      .leftJoinAndSelect("quizz.sense", "sense")
      .leftJoinAndSelect("quizz.senseDetail", "senseDetail")
      .leftJoinAndSelect("sense.lemma", "lemma")
      .where("wordlist.owner_id =:ownerId", { ownerId })
      .andWhere("quizz.type=:quizzType", { quizzType });

    switch (quizzType) {
      case QuizzType.WordFromAudio:
        queryBuilder.innerJoinAndSelect(
          "lemma.pronunciations",
          "pronunciation"
        );
        break;
      case QuizzType.WordFromMeaning:
      case QuizzType.MeaningFromWord:
        queryBuilder.innerJoin(
          "sense.details",
          "detail",
          "detail.type = :type",
          { type: SenseDetailType.DEFINITION }
        );
        break;
      case QuizzType.Synonym:
        queryBuilder.innerJoinAndSelect("sense.synonyms", "synonym");
        break;
      case QuizzType.FillSentence:
        queryBuilder.innerJoin(
          "sense.details",
          "detail",
          "detail.type = :type",
          { type: SenseDetailType.EXAMPLE }
        );
        break;
      default:
        break;
    }

    if (wordlistId) {
      queryBuilder.andWhere("wordlist.id=:wordlistId", { wordlistId });
    }
    return queryBuilder.orderBy("quizz.updatedAt", "ASC").getOne();
  }

  static async nextQuizz(
    ownerId: number,
    wordlistId?: number,
    types?: string[]
  ): Promise<QuizzWithOptions<string | Lemma>> {
    const quizzRepository = getRepository(Quizz);

    const sequence = [
      QuizzType.WordFromMeaning,
      QuizzType.Synonym,
      QuizzType.WordFromAudio,
      QuizzType.MeaningFromWord,
      QuizzType.FillSentence,
      QuizzType.FillNewsSentence,
    ];

    const lastQuizz = await quizzRepository.findOne({
      order: { id: "DESC" },
      where: { ownerId },
    });

    logger.debug(types);
    logger.debug(`Last quizz type: ${lastQuizz?.type}`);

    const lastQuizzTypeIdx = lastQuizz
      ? sequence.indexOf(lastQuizz.type)
      : sequence.length - 1;
    let quizzTypeIdx = lastQuizzTypeIdx;

    do {
      quizzTypeIdx =
        quizzTypeIdx + 1 === sequence.length ? 0 : quizzTypeIdx + 1;
      const nextType = sequence[quizzTypeIdx];
      logger.debug(`Trying to find ${nextType} quizz`);

      if (!types?.includes(nextType)) {
        logger.debug(`${nextType} isn't in types list, skipping ...`);
        continue;
      }

      try {
        switch (nextType) {
          case QuizzType.Synonym:
            return await QuizzService.nextSynonymQuizz(ownerId, wordlistId);
          case QuizzType.WordFromMeaning:
            return await WordFromMeaningQuizzService.next(ownerId, wordlistId);
          case QuizzType.WordFromAudio:
            return await QuizzService.nextWordFromAudioQuizz(
              ownerId,
              wordlistId
            );
          case QuizzType.MeaningFromWord:
            return await MeaningFromWordQuizzService.next(ownerId, wordlistId);
          case QuizzType.FillNewsSentence:
          case QuizzType.FillSentence:
            return await FillSentenceQuizzService.next(ownerId, wordlistId);
          default:
            throw new Error("unexpected type: " + nextType);
        }
      } catch (error) {
        logger.error(`No ${nextType} quizz found`, {
          error,
          ownerId,
          wordlistId,
        });
      }
    } while (quizzTypeIdx !== lastQuizzTypeIdx);

    throw new Error("No quizz available");
  }

  static async nextSynonymQuizz(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<Lemma>> {
    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.Synonym,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");
    if (!quizz.wordId) throw new Error("no wordId");

    if (!sense?.synonyms?.length) throw new Error("fix me: no synonyms");
    const synonymIdx = Math.floor(Math.random() * sense.synonyms.length);
    const synonym = sense.synonyms[synonymIdx];

    const lemma = sense.lemma;
    if (!lemma) throw new Error("no lemma");
    if (!lemma.language) throw new Error(`no language for lemma ${lemma.id}`);

    const options = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
      lemma.language.split('-')[0],
      lemma.lexicalCategory
    );
    if (!options?.length) {
      throw new Error("no options");
    }

    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    options.splice(rightOptionIdx, 0, synonym);

    return { quizz, options, rightOptionIdx };
  }

  static async nextWordFromAudioQuizz(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<Lemma>> {
    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.WordFromAudio,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");
    if (!quizz.wordId) throw new Error("no wordId");

    const lemma = sense.lemma;
    if (!lemma) throw new Error("no lemma");
    if (!lemma.language) throw new Error("no language for lemma ${lemma.id}");
    if (!lemma?.pronunciations?.length) throw new Error(`no pronunciations for lemma ${lemma.id}`);

    const allPronunciations = lemma.pronunciations;
    const pronunciationIdx = Math.floor(
      Math.random() * allPronunciations.length
    );
    const pronunciation = allPronunciations[pronunciationIdx];

    const options = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
      lemma.language.split('-')[0],
      lemma.lexicalCategory
    );
    if (!options?.length) {
      throw new Error("no options");
    }

    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    options.splice(rightOptionIdx, 0, lemma);

    return {
      quizz,
      options,
      rightOptionIdx,
      audioFile: pronunciation.audioFile,
    };
  }
}
