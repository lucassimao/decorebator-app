import { getRepository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Lemma from "../entities/lemma";
import Quizz from "../entities/quizz";
import QuizzType from "../entities/quizzType";
import LemmaService from "./lemma.service";
import SenseService from "./sense.service";
import WordService from "./word.service";
import stringSimilarity from "string-similarity";
import logger from "../logger";

const OPTIONS_LENGTH = 4;
interface QuizzWithOptions<T> {
  quizz: Quizz;
  options: T[];
  rightOptionIdx: number;
  text?: string;
  audioFile?: string;
}

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

  private static async loadOrCreateQuizz(
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

  private static async registerNew(
    wordId: number,
    ownerId: number,
    type: QuizzType,
    senseId: number
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
      .innerJoinAndSelect("quizz.sense", "sense")
      .innerJoinAndSelect("sense.lemma", "lemma")
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
        queryBuilder.addSelect(["sense.definitions"]);
        break;
      case QuizzType.Synonym:
        queryBuilder.innerJoinAndSelect("sense.synonyms", "synonym");
        break;
      case QuizzType.FillSentence:
        queryBuilder.andWhere("array_length(sense.examples,1)>0");
        queryBuilder.addSelect(["sense.examples"]);
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
    type?: string
  ): Promise<QuizzWithOptions<string | Lemma>> {
    if (type) {
      switch (type) {
        case QuizzType.Synonym:
          return QuizzService.nextSynonymQuizz(ownerId, wordlistId);
        case QuizzType.WordFromMeaning:
          return QuizzService.nextWordFromMeaningQuizz(ownerId, wordlistId);
        case QuizzType.WordFromAudio:
          return QuizzService.nextWordFromAudioQuizz(ownerId, wordlistId);
        case QuizzType.MeaningFromWord:
          return QuizzService.nextMeaningFromWordQuizz(ownerId, wordlistId);
        case QuizzType.FillSentence:
          return QuizzService.nextFillSentenceQuizz(ownerId, wordlistId);
        default:
          throw new Error("unexpected type: " + type);
      }
    }

    const quizzRepository = getRepository(Quizz);
    const lastQuizz = await quizzRepository.findOne({
      order: { updatedAt: "DESC" },
      where: { ownerId },
    });

    const sequence = [
      QuizzType.Synonym,
      QuizzType.WordFromMeaning,
      QuizzType.WordFromAudio,
      QuizzType.MeaningFromWord,
      QuizzType.FillSentence,
    ];

    const lastQuizzTypeIdx = lastQuizz
      ? sequence.indexOf(lastQuizz.type)
      : sequence.length - 1;
    let quizzTypeIdx = lastQuizzTypeIdx;

    do {
      quizzTypeIdx =
        quizzTypeIdx + 1 === sequence.length ? 0 : quizzTypeIdx + 1;

      try {
        logger.debug(`Trying to find quizz ${sequence[quizzTypeIdx]}`);
        const quizz = await QuizzService.nextQuizz(
          ownerId,
          wordlistId,
          sequence[quizzTypeIdx]
        );
        if (quizz) {
          return quizz;
        }
      } catch (error) {
        logger.error(`No ${sequence[quizzTypeIdx]} quizz found`, {
          error,
          ownerId,
          wordlistId,
        });
      }
    } while (quizzTypeIdx !== lastQuizzTypeIdx);

    throw new Error("No quizz available");
  }

  static async nextFillSentenceQuizz(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<string>> {
    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.FillSentence,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");
    if (!sense.examples?.length) throw new Error("no examples");
    if (!sense.lemma) throw new Error("no lemma");

    const exampleIdx = Math.floor(Math.random() * sense.examples.length);
    const example = sense.examples[exampleIdx];

    const lemma = sense.lemma;
    const randomLemmas = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
      lemma?.lexicalCategory
    );
    const options = randomLemmas.map((lemma) => lemma.name);

    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    const regex = new RegExp(`\b${lemma.name}\b`);
    if (regex.test(example)) {
      options.splice(rightOptionIdx, 0, lemma.name);
    } else {
      const {
        bestMatch: { target },
      } = stringSimilarity.findBestMatch(lemma.name, example.split(" "));
      options.splice(rightOptionIdx, 0, target);
    }

    return { quizz, options, rightOptionIdx, text: example };
  }

  static async nextMeaningFromWordQuizz(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<string>> {
    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.MeaningFromWord,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");

    const allDefinitions = sense.definitions ?? [];
    const definitionIdx = Math.floor(Math.random() * allDefinitions.length);
    const definition = allDefinitions[definitionIdx];

    const lemma = sense.lemma;
    const options = await SenseService.getRandomDefinitions(
      OPTIONS_LENGTH,
      lemma?.lexicalCategory
    );

    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    options.splice(rightOptionIdx, 0, definition);

    return { quizz, options, rightOptionIdx };
  }

  static async nextWordFromMeaningQuizz(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<Lemma>> {
    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.WordFromMeaning,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");
    if (!quizz.wordId) throw new Error("no wordId");

    const lemma = sense.lemma;
    if (!lemma) throw new Error("no lemma");

    const allDefinitions = sense.definitions ?? [];
    const definitionIdx = Math.floor(Math.random() * allDefinitions.length);
    const definition = allDefinitions[definitionIdx];

    const options = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
      lemma.lexicalCategory
    );
    if (!options?.length) {
      throw new Error("no options");
    }

    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    options.splice(rightOptionIdx, 0, lemma);

    return { quizz, options, rightOptionIdx, text: definition };
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

    const options = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
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
    if (!lemma?.pronunciations?.length) throw new Error("no pronunciations");

    const allPronunciations = lemma.pronunciations;
    const pronunciationIdx = Math.floor(
      Math.random() * allPronunciations.length
    );
    const pronunciation = allPronunciations[pronunciationIdx];

    const options = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
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
