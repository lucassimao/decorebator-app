import { getRepository } from "typeorm";
import QuizzWithOptions from "../../dtos/quizzWithOptions";
import Lemma from "../../entities/lemma";
import Quizz from "../../entities/quizz";
import QuizzType from "../../entities/quizzType";
import SenseDetail from "../../entities/senseDetail";
import SenseDetailType from "../../entities/senseDetailType";
import LemmaService from "../lemma.service";
import QuizzService, { OPTIONS_LENGTH } from "../quizz.service";

export default class WordFromMeaningQuizzService {
  static async next(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<Lemma>> {
    const senseDetailRepository = getRepository(SenseDetail);
    const quizzRepository = getRepository(Quizz);

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

    if (!quizz.senseDetail) {
      const senseDetail = await senseDetailRepository
        .createQueryBuilder("senseDetail")
        .leftJoinAndSelect(
          "senseDetail.quizzes",
          "quizz",
          "quizz.type=:quizzType",
          { quizzType: QuizzType.WordFromMeaning }
        )
        .where("senseDetail.senseId =:senseId AND senseDetail.type =:type", {
          senseId: sense.id,
          type: SenseDetailType.DEFINITION,
        })
        // .andWhere('quizz is NULL')
        .orderBy("quizz.id", "ASC", "NULLS FIRST")
        .addOrderBy("senseDetail.id", "ASC")
        .getOne();

      if (!senseDetail) {
        throw new Error("no senseDetail");
      }
      await quizzRepository.update(quizz.id, { senseDetail });
      quizz.senseDetail = senseDetail;
    }

    const definition = quizz.senseDetail.detail;

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
}
