import { getRepository } from "typeorm";
import QuizzWithOptions from "../../dtos/quizzWithOptions";
import Quizz from "../../entities/quizz";
import QuizzType from "../../entities/quizzType";
import SenseDetail from "../../entities/senseDetail";
import SenseDetailType from "../../entities/senseDetailType";
import QuizzService, { OPTIONS_LENGTH } from "../quizz.service";
import SenseService from "../sense.service";

export default class MeaningFromWordQuizzService {
  static async next(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<string>> {
    const senseDetailRepository = getRepository(SenseDetail);
    const quizzRepository = getRepository(Quizz);

    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.MeaningFromWord,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");

    if (!quizz.senseDetail) {
      const senseDetail = await senseDetailRepository
        .createQueryBuilder("senseDetail")
        .leftJoinAndSelect(
          "senseDetail.quizzes",
          "quizz",
          "quizz.type=:quizzType",
          { quizzType: QuizzType.MeaningFromWord }
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

    const lemma = sense.lemma;
    const options = await SenseService.getRandomDefinitions(
      OPTIONS_LENGTH,
      lemma?.lexicalCategory
    );

    const rightOptionIdx = Math.floor(Math.random() * OPTIONS_LENGTH);
    options.splice(rightOptionIdx, 0, definition);

    return { quizz, options, rightOptionIdx };
  }
}
