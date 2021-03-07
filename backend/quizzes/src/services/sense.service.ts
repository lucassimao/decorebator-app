import { getRepository } from "typeorm";
import Sense from "../entities/sense";
import SenseDetail from "../entities/senseDetail";
import SenseDetailType from "../entities/senseDetailType";

const SenseService = {
  getRandomDefinitions: async (
    qty: number,
    lexicalCategory?: string
  ): Promise<string[]> => {
    const senseDetailRepository = getRepository(SenseDetail);

    const qBuilder = senseDetailRepository
      .createQueryBuilder("senseDetail")
      .select("senseDetail.detail")
      .where("senseDetail.type=:type", { type: SenseDetailType.DEFINITION })
      .limit(qty)
      .orderBy("RANDOM()");

    if (lexicalCategory) {
      qBuilder
        .innerJoin("senseDetail.sense", "sense")
        .leftJoin("sense.lemma", "lemma")
        .andWhere("lemma.lexicalCategory=:lexicalCategory", {
          lexicalCategory,
        });
    }

    const randomDefinitions = await qBuilder.getMany();
    return randomDefinitions.map((senseDetail) => senseDetail.detail);
  },
};

export default SenseService;
