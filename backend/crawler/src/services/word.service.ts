import { getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import Word from "../entities/word";
import { getConnection } from "typeorm";

class WordService {

  static async exists(wordId?: number): Promise<boolean> {
    if (!wordId) return false;

    const repository = getRepository(Word);
    const count = await repository.count({ where: { id: wordId } })
    return count === 1
  }

  static async updateWordLemmas(wordId: number, lemmas: Lemma[]): Promise<boolean> {

    await getConnection().transaction(async transactionalEntityManager => {

      for (const lemma of lemmas) {
        await transactionalEntityManager.query(
          "insert into word_lemmas_lemma(word_id,lemma_id) values ($1,$2)  ON CONFLICT DO NOTHING",
          [wordId, lemma.id]
        );
      }

    });

    return true;
  }
};

export default WordService;
