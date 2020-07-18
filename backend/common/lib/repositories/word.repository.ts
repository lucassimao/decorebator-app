import { FindOptions } from "sequelize/types"
import WordDTO from "../dto/word.dto"
import { Image } from "../entities/image"
import { Word } from "../entities/word"
import { Wordlist } from "../entities/wordlist"

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

    async getByIdWithImages(wordlistId: number, wordId: number, userId: number): Promise<WordDTO | undefined> {
        const word = await Word.findOne({
            where: { wordlistId, id: wordId, '$Wordlist.ownerId$': userId },
            include: [{ model: Wordlist, attributes: [] }, { model: Image }]
        })

        if (word) {
            return {
                id: word.get('id'), 
                createdAt: word.get('createdAt').toISOString(),
                images: await word.getImages(),
                name: word.get('name'),
                wordlistId: word.get('wordlistId')
            } as WordDTO
        }
    },

    async getWordsFromWordlist(wordlistId: number, userId: number, paginationArgs?: PaginationArgs): Promise<WordDTO[] | undefined> {
        let options: FindOptions = {
            attributes: ['id', 'name', 'wordlistId', 'createdAt'],
            where: { wordlistId, '$Wordlist.ownerId$': userId },
            include: [{ model: Wordlist, attributes: [] }]
        }
        if (paginationArgs) {
            const { offset, limit } = paginationArgs
            options = { ...options, offset, limit }
        }
        const words = await Word.findAll(options)
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