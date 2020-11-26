import { getRepository } from "typeorm";
import Lemma from "../entities/lemma";
import { WordDTO } from "../types/word.dto";


async function save(lemma: Partial<Lemma>): Promise<Lemma> {
    const repository = getRepository(Lemma)
    return repository.save(lemma)
}

const exists = async(word:WordDTO) => {
    const repository = getRepository(Lemma)
    const count = await repository.count({where: {language: word.languageCode, name: word.name}}) 
    return count === 1
}

const findByNameAndLanguage = async(name: string,language: string) => {
    const repository = getRepository(Lemma)
    return repository.findOne({where: {language, name}}) 
}

const LemmaService = {save, exists,findByNameAndLanguage}
export default LemmaService;