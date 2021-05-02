import stringSimilarity from "string-similarity";
import { getRepository } from "typeorm";
import QuizzWithOptions from "../../dtos/quizzWithOptions";
import Lemma from "../../entities/lemma";
import Quizz from "../../entities/quizz";
import QuizzType from "../../entities/quizzType";
import Sense from "../../entities/sense";
import SenseDetail from "../../entities/senseDetail";
import SenseDetailType from "../../entities/senseDetailType";
import Word from "../../entities/word";
import ElasticSearchService from "../elasticSearchService";
import LemmaService from "../lemma.service";
import QuizzService, { OPTIONS_LENGTH } from "../quizz.service";
import logger from "../../logger";

export default class FillSentenceQuizzService {
  static async getSenseExampleBasedQuizz(
    sense: Sense,
    allowPreviouslyUsedSenses = true
  ): Promise<SenseDetail | undefined> {
    const senseDetailRepository = getRepository(SenseDetail);

    const queryBuilder = await senseDetailRepository
      .createQueryBuilder("senseDetail")
      .leftJoinAndSelect("senseDetail.quizzes", "quizz")
      .where("senseDetail.senseId =:senseId AND senseDetail.type =:type", {
        senseId: sense.id,
        type: SenseDetailType.EXAMPLE,
      });
    if (allowPreviouslyUsedSenses) {
      queryBuilder.orderBy("quizz.id", "ASC", "NULLS FIRST");
    } else {
      queryBuilder.andWhere("quizz is NULL");
    }

    const senseDetail = await queryBuilder
      .addOrderBy("senseDetail.id", "ASC")
      .getOne();
    return senseDetail;
  }

  private static async nextFillNewsSentenceQuizz(
    word: Word,
    ownerId: number
  ): Promise<QuizzWithOptions<string>> {
    if (!word?.id) throw new Error("invalid word");

    const quizzRepository = getRepository(Quizz);
    let quizz = await quizzRepository.findOne({
      where: { ownerId, type: QuizzType.FillNewsSentence, wordId: word.id },
    });

    if (!quizz) {
      quizz = await QuizzService.registerNew(
        word.id,
        ownerId,
        QuizzType.FillNewsSentence
      );
    }

    try {
      const { example, sort } = await ElasticSearchService.getExample(
        word.name,
        "en",
        quizz.esSearchAfter
      );
      await quizzRepository.update(quizz.id, { esSearchAfter: sort });

      const regex = /<em>(.+)<\/em>/;
      const matchResult = example.match(regex);
      if (!matchResult?.length)
        throw new Error("invalid ES result: " + example);

      const [, rightOption] = matchResult;
      return FillSentenceQuizzService.buildQuizzWithOptions(
        quizz,
        rightOption,
        example.replace(/<em>|<\/em>/gi, "")
      );
    } catch (error) {
      if (quizz.esSearchAfter) {
        await quizzRepository.update(quizz.id, { esSearchAfter: 0 });
      }
      throw error;
    }
  }

  static async next(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<string>> {
    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.FillSentence,
      wordlistId
    );
    if (!quizz.word) throw new Error("no sense");
    if (!quizz.sense) throw new Error("no sense");
    if (!quizz.sense.lemma) throw new Error("no lemma");

    const quizzRepository = getRepository(Quizz);
    const lemma = quizz.sense.lemma;
    let fetchFromElasticSearch = true;

    if (!quizz.senseDetail) {
      const senseDetail = await FillSentenceQuizzService.getSenseExampleBasedQuizz(
        quizz.sense
      );
      if (senseDetail) {
        await quizzRepository.update(quizz.id, {
          senseDetail,
          esSearchAfter: 0,
        });
        quizz.senseDetail = senseDetail;
        fetchFromElasticSearch = false;
      }
    }

    if (fetchFromElasticSearch) {
      try {
        const result = await FillSentenceQuizzService.nextFillNewsSentenceQuizz(
          quizz.word,
          ownerId
        );
        return result;
      } catch (error) {
        logger.error(error);
      }
    }

    if (!quizz.senseDetail) throw new Error("invalid senseDetail");

    let rightOption = lemma.name;
    const example = quizz.senseDetail.detail;
    const regex = new RegExp(`\b${lemma.name}\b`);

    if (!regex.test(example)) {
      const {
        bestMatch: { target },
      } = stringSimilarity.findBestMatch(lemma.name, example.split(" "));
      rightOption = target;
    }

    return FillSentenceQuizzService.buildQuizzWithOptions(
      quizz,
      rightOption,
      example,
      lemma
    );
  }

  private static async buildQuizzWithOptions(
    quizz: Quizz,
    rightOption: string,
    text: string,
    lemma?: Lemma
  ): Promise<QuizzWithOptions<string>> {
    const randomLemmas = await LemmaService.getRandomLemmasForWord(
      quizz.wordId,
      OPTIONS_LENGTH,
      lemma?.lexicalCategory
    );
    const options = randomLemmas.map((lemma) => lemma.name);
    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    options.splice(rightOptionIdx, 0, rightOption);

    return { quizz, options, rightOptionIdx, text };
  }
}
