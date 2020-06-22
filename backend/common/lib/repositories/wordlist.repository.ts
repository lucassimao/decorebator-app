import Database from "../db"
import WordlistDTO from "../dto/wordlist.dto"
import { BinaryExtraction } from "../entities/binaryExtraction"
import { Word } from "../entities/word"
import { Wordlist } from "../entities/wordlist"
import { WordlistQueryBuilder } from "./wordlistQueryBuilder"
import WordDTO from "../dto/word.dto"

const WordlistRepository = {
    async filter(queryBuilder: WordlistQueryBuilder): Promise<Array<WordlistDTO>> {
        const results = await Wordlist.findAll(queryBuilder.build()) ?? []
        return results.map((wordlist) => wordlist.get({ plain: true }) as WordlistDTO)
    },

    save(wordlist: WordlistDTO, ownerId: number, words?: WordDTO[], extraction?: BinaryExtraction): Promise<WordlistDTO> {
        return Database.instance.doInsideTransaction(async () => {
            const newWordlist = await Wordlist.create({ ...wordlist, ownerId })
            if (words){
                await Word.bulkCreate(words.map(word => ({ ...word, wordlistId: newWordlist.id })))
            }
            if (extraction) {
                await newWordlist.createBinaryExtraction({ ...extraction })
            }
            return newWordlist.get({ plain: true }) as WordlistDTO
        })
    },
    async update(values: {[key in keyof WordlistDTO]: any }, id: number, ownerId: number): Promise<number> {
        const [nModified] = await Wordlist.update(values, { where: { id, ownerId } })
        return nModified
    },
    async delete(id: number, ownerId: number): Promise<number> {
        const deletedCount = await Wordlist.destroy({ where: { id, ownerId } })
        return deletedCount
    }
}

export default WordlistRepository