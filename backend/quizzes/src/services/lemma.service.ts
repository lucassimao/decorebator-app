import { getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import Sense from "../entities/sense";

const LemmaService = {
  getRandomLemmasForWord: async (
    wordId: number,
    qty: number,
    lexicalCategory?: string
  ): Promise<Lemma[] | undefined> => {
    const lemmaRepository = getRepository(Lemma);

    const qBuilder = lemmaRepository
      .createQueryBuilder("lemma")
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("synonym.id")
          .select("lemma.id")
          .from(Sense, "sense")
          .innerJoin("sense.synonyms", "synonym")
          .innerJoin("sense.lemma", "lemma")
          .innerJoin("lemma.words", "word")
          .where("word.id=:wordId", { wordId })
          .getQuery();
        return `lemma.id NOT IN (${subQuery})`;
      })
      .limit(qty)
      .orderBy("RANDOM()");

    if (lexicalCategory) {
      qBuilder.andWhere("lemma.lexicalCategory=:lexicalCategory", {
        lexicalCategory,
      });
    }

    return qBuilder.getMany();
  },
};

export default LemmaService;
