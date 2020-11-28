import { FindConditions, getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import { WordDTO } from "../types/word.dto";

const LemmaService = {

    async save(lemma: Partial<Lemma>): Promise<Lemma> {
        const repository = getRepository(Lemma)
        return repository.save(lemma)
    },

    async exists(word: WordDTO): Promise<boolean> {
        const repository = getRepository(Lemma)
        const count = await repository.count({ where: { language: word.languageCode, name: word.name } })
        return count === 1
    },

    async findAllBy(criteria: FindConditions<Lemma>): Promise<Lemma[]> {
        const repository = getRepository(Lemma)
        return repository.find({ where: criteria })
    },

    async findOneBy(criteria: FindConditions<Lemma>): Promise<Lemma|undefined> {
        const repository = getRepository(Lemma)
        return repository.findOne({ where: criteria })
    }    ,

    async getPlaceholders(): Promise<Lemma[]> {
        const repository = getRepository(Lemma)
        return repository.find({ where: {lexicalCategory:'unknow'} })
    }
}
export default LemmaService;