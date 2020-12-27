import { getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import Word from "../entities/word";

const WordService = {

    async updateWordLemmas(wordId: number, lemmas: Lemma[]): Promise<boolean> {
        const repository = getRepository(Word)
        await repository.save({id: wordId,lemmas})
        return true;
    },

}
export default WordService;