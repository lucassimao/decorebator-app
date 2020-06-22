import { Word } from "../entities/word"
import { Wordlist } from "../entities/wordlist"
import WordDTO from "../dto/word.dto"

type PaginationArgs = { offset: number, limit: number }

const WordRepository = {
    async getById(wordlistId: number, wordId: number, userId: number): Promise<WordDTO | undefined> {
        const word = await Word.findOne({
            attributes: ['id', 'name', 'wordlistId', 'createdAt'], where: { wordlistId, id: wordId, '$Wordlist.ownerId$': userId },
            include: [{ model: Wordlist, attributes: [] }]
        })
        if (word) {
            return word.get({ plain: true }) as WordDTO
        }
    },

    async getAllWordsFromWordlist(wordlistId: number, userId: number, paginationArgs?: PaginationArgs): Promise<WordDTO[] | undefined> {
        const { offset, limit } = paginationArgs ?? {}
        const words = await Word.findAll({
            attributes: ['id', 'name', 'wordlistId', 'createdAt'],
            where: { wordlistId, '$Wordlist.ownerId$': userId },
            offset, limit, include: [{ model: Wordlist, attributes: [] }]
        })
        return words?.map(w => w.get({ plain: true }) as WordDTO)
    },

    async createWord(wordlistId: number, name: string, ownerId: number): Promise<number | undefined> {
        const wordlist = await Wordlist.findOne({ where: { id: wordlistId, ownerId } })
        if (wordlist) {
            const { id } = await wordlist.createWord({ name })
            return id
        }
    },

    async updateWord(updatedName: string, wordlistId: number, wordId: number, userId: number): Promise<boolean> {
        const word = await Word.findOne({
            attributes: ['id', 'name'], where: { wordlistId, id: wordId, '$Wordlist.ownerId$': userId },
            include: [{ model: Wordlist, attributes: [] }]
        })
        if (word) {
            word.name = updatedName
            await word.save({ fields: ['name'] })
            return true
        } else {
            return false
        }

    },

    async deleteWord(wordlistId: number, wordId: number, userId: number): Promise<boolean> {
        const word = await Word.findOne({
            attributes: ['id'], where: { wordlistId, id: wordId, '$Wordlist.ownerId$': userId },
            include: [{ model: Wordlist, attributes: [] }]
        })
        if (word) {
            await word.destroy()
            return true
        } else {
            return false
        }
    },
}

export default WordRepository