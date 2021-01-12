import { Brackets, getRepository, SelectQueryBuilder } from "typeorm";
import Quizz from "../entities/quizz";
import QuizzType from "../entities/quizzType";
import Word from "../entities/word";

export const notExistsQuery = <T>(builder: SelectQueryBuilder<T>): string =>
  `not exists (${builder.getQuery()})`;

const WordService = {
  getNextWordForQuizz: async (
    ownerId: number,
    quizzType: QuizzType,
    wordlistId?: number
  ): Promise<Word | undefined> => {
    const wordRepository = getRepository(Word);
    const quizzRepository = getRepository(Quizz);
    const subQuery = quizzRepository
      .createQueryBuilder("quizz")
      .select("1")
      .where("quizz.senseId = sense.id and quizz.type=:quizzType");

    const queryBuilder = wordRepository
      .createQueryBuilder("word")
      .innerJoin("word.wordlist", "wordlist")
      .innerJoinAndSelect("word.lemmas", "lemma")
      .innerJoinAndSelect("lemma.senses", "sense")
      .innerJoinAndSelect("sense.lemma", "senseLemma")
      .leftJoin("sense.quizzes", "quizz")
      .where("wordlist.owner_id =:ownerId", { ownerId })
      .andWhere(
        new Brackets((qb) =>
          qb.where("quizz.senseId IS NULL").orWhere(notExistsQuery(subQuery))
        )
      )
      .setParameter("quizzType", quizzType);
    // word's sense not yet used for quizzes

    switch (quizzType) {
      case QuizzType.WordFromMeaning:
      case QuizzType.MeaningFromWord:
        queryBuilder.addSelect(["sense.definitions"]);
        break;
      case QuizzType.Synonym:
        queryBuilder.innerJoinAndSelect("sense.synonyms", "synonym"); //only lemmas with synonym
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

    return queryBuilder.orderBy("RANDOM()").limit(1).getOne();
  },
};

export default WordService;
