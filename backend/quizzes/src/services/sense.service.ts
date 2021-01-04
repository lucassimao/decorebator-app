import { getRepository } from "typeorm";
import Sense from "../entities/sense";

const SenseService = {
  getRandomDefinitions: async (
    qty: number,
    lexicalCategory?: string
  ): Promise<string[]> => {
    const senseRepository = getRepository(Sense);

    const qBuilder = senseRepository
      .createQueryBuilder("sense")
      .select(["sense.definitions"])
      .limit(qty)
      .orderBy("RANDOM()");

    if (lexicalCategory) {
      qBuilder
        .leftJoin("sense.lemma", "lemma")
        .andWhere("lemma.lexicalCategory=:lexicalCategory", {
          lexicalCategory,
        });
    }

    const randomSenses = await qBuilder.getMany();
    const set = new Set<string>();
    const allDefinitions = randomSenses.flatMap(
      ({ definitions }) => definitions ?? []
    );

    do {
      const idx = Math.floor(Math.random() * allDefinitions.length);
      set.add(allDefinitions[idx]);
    } while (set.size < qty);

    return [...set];
  },
};

export default SenseService;
