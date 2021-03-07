import stringSimilarity from "string-similarity";
import { getRepository } from "typeorm";
import QuizzWithOptions from "../../dtos/quizzWithOptions";
import Quizz from "../../entities/quizz";
import QuizzType from "../../entities/quizzType";
import SenseDetail from "../../entities/senseDetail";
import SenseDetailType from "../../entities/senseDetailType";
import LemmaService from "../lemma.service";
import QuizzService, { OPTIONS_LENGTH } from "../quizz.service";

export default class FillSentenceQuizzService {
  static async next(
    ownerId: number,
    wordlistId?: number
  ): Promise<QuizzWithOptions<string>> {
    const senseDetailRepository = getRepository(SenseDetail);
    const quizzRepository = getRepository(Quizz);

    const quizz = await QuizzService.loadOrCreateQuizz(
      ownerId,
      QuizzType.FillSentence,
      wordlistId
    );
    const sense = quizz.sense;

    if (!sense) throw new Error("no sense");
    if (!sense.lemma) throw new Error("no lemma");

    // select sense_detail.id, sense_detail.type,QUIZZ.ID as quizzid from sense_detail
    // left join quizz on quizz.sense_detail_id=sense_detail.id
    // order by quizz.id ASC NULLS FIRST, sense_detail.id asc ;

    if (!quizz.senseDetail) {
      const senseDetail = await senseDetailRepository
        .createQueryBuilder("senseDetail")
        .leftJoinAndSelect("senseDetail.quizzes", "quizz")
        .where("senseDetail.senseId =:senseId AND senseDetail.type =:type", {
          senseId: sense.id,
          type: SenseDetailType.EXAMPLE,
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

    const example = quizz.senseDetail.detail;
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
}
