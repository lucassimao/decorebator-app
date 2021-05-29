import { getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import Word from "../entities/word";

const WordService = {
  async exists(wordId?: number): Promise<boolean> {
    if (!wordId) return false;

    const repository = getRepository(Word);
    const count = await repository.count({ where: { id: wordId } })
    return count === 1
  },

  async updateWordLemmas(wordId: number, lemmas: Lemma[]): Promise<boolean> {
    const repository = getRepository(Word);
    const wordWithLemmas = await repository
      .createQueryBuilder("word")
      .leftJoinAndSelect("word.lemmas", "lemma")
      .select(["word.id", "lemma.id"])
      .where("word.id=:wordId", { wordId })
      .getOne();

    const alreadyAssociatedLemmasIds = wordWithLemmas?.lemmas?.map(
      (lemma) => lemma.id
    );
    const onlyLemmasNotYetAssociated = lemmas.filter(
      (lemma) => !alreadyAssociatedLemmasIds?.includes(lemma.id)
    );

    await repository
      .createQueryBuilder()
      .relation(Word, "lemmas")
      .of(wordId)
      .add(onlyLemmasNotYetAssociated);

    await repository.save({ id: wordId, lemmas });
    return true;
  },
};
export default WordService;
