import ImageDTO from "../dto/image.dto"
import { Image } from "../entities/image"
import { Word } from "../entities/word"
import { Wordlist } from "../entities/wordlist"

const findWord = async (wordlistId: number, wordId: number, ownerId: number): Promise<Word | null> => {
    return Word.findOne({
        attributes: ['id'], where: { wordlistId, id: wordId, '$Wordlist.ownerId$': ownerId },
        include: [{ model: Wordlist, attributes: [] }]
    })
}

const ImageRepository = {

    async addImage(wordlistId: number, wordId: number, ownerId: number, { description, url }: ImageDTO): Promise<ImageDTO | undefined> {
        const word = await findWord(wordlistId, wordId, ownerId)
        if (word) {
            const image = await word.createImage({ description, url })
            return image?.get({ plain: true })
        }
    },

    async deleteImage(wordlistId: number, wordId: number, ownerId: number, imageId: number): Promise<boolean> {
        const word = await findWord(wordlistId, wordId, ownerId)
        if (word) {
            await word.deleteImage(imageId)
            return true
        }
        return false
    },

    async updateImage(wordlistId: number, wordId: number, ownerId: number, imageId: number, { description, url }: ImageDTO): Promise<boolean> {
        const word = await findWord(wordlistId, wordId, ownerId)
        if (word) {
            const [nUpdated] = await Image.update({description,url},{where: {wordId,id: imageId}})
            return nUpdated === 1
        }
        return false
    }

}

export default ImageRepository