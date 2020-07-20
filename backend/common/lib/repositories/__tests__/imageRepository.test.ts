

import Database from '../../db'
import WordDTO from '../../dto/word.dto'
import WordlistDTO from '../../dto/wordlist.dto'
import { User } from '../../entities/user'
import { Word } from '../../entities/word'
import ImageRepository from '../image.repository'
import WordlistRepository from '../wordlist.repository'


beforeEach(async () => {
    await Database.connect('sqlite::memory:')
    await Database.instance.sync()

    const user = await User.create({ name: 'Lucas', email: 'user1@gmail.com', country: 'BR', encryptedPassword: '123' })
    const dto: WordlistDTO = {
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
    }
    const wordsDTO: WordDTO[] = ['it', 'works', 'as', 'expected'].map(name => ({ name }));
    await WordlistRepository.save(dto, user.id!, wordsDTO)
    const allWords = await Word.findAll()
    await Promise.all(allWords.map(word => word.createImage({url: `http://decorebator.com/image/${word.id}`, description: `Image for ${word.name}`})))
})

afterEach(async () => {
    await Database.instance.disconnect()
})

it('should be able to delete an existing image', async () => {

    const owner = await User.findOne()
    const word = await Word.findOne()
    const wordlist = await word!.getWordlist()
    const images = await word!.getImages()
    await ImageRepository.deleteImage(wordlist.id!, word?.id!, owner?.id!, images[0].id!)

    expect(await word!.countImages()).toEqual(0)
})