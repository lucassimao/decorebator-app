import { getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import Sense from "../entities/sense";

const LemmaService = {
  getRandomLemmasForWord: async (
    wordId: number,
    qty: number,
    lexicalCategory?: string
  ): Promise<Lemma[]> => {
    const lemmaRepository = getRepository(Lemma);

    const qBuilder = lemmaRepository
      .createQueryBuilder("lemma")
      .where((qb) => {
        const baseSubQuery = qb
          .subQuery()
          .from(Sense, "sense")
          .innerJoin("sense.synonyms", "synonym")
          .innerJoin("sense.lemma", "lemma")
          .innerJoin("lemma.words", "word")
          .where("word.id=:wordId");

        const subQuery1 = baseSubQuery.select("synonym.id").getSql();
        const subQuery2 = baseSubQuery.select("lemma.id").getSql();
        const subQuery = `${subQuery1} UNION ${subQuery2}`;

        return `lemma.id NOT IN (${subQuery})`;
      })
      .limit(qty)
      .setParameters({ wordId, lexicalCategory })
      .orderBy("RANDOM()");

    if (lexicalCategory) {
      qBuilder.andWhere("lemma.lexicalCategory=:lexicalCategory");
    }

    return qBuilder.getMany();
  },
};

export default LemmaService;
