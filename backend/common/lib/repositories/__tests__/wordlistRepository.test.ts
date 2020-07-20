import Database from '../../db'
import WordDTO from '../../dto/word.dto'
import WordlistDTO from '../../dto/wordlist.dto'
import { User } from '../../entities/user'
import { Wordlist } from '../../entities/wordlist'
import WordlistRepository from '../wordlist.repository'
import { WordlistQueryBuilder } from '../wordlistQueryBuilder'
import { Word } from '../../entities/word'




beforeEach(async () => {
    await Database.connect('sqlite::memory:')
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
})

afterEach(async () => {
    await Database.instance.disconnect()
})

it('should be able to return the wordlist without words', async () => {
    const user = await User.findOne()
    const wordlist = await Wordlist.findOne()

    const queryBuilder = new WordlistQueryBuilder()
    queryBuilder.ownerId(user?.id!).id(wordlist?.id!)
    const [result] = await WordlistRepository.filter(queryBuilder)

    expect(result).not.toBeInstanceOf(Wordlist)
    expect(result.words).toBeFalsy()
})

it('should be able to return the wordlist WITH words', async () => {
    const user = await User.findOne()
    const wordlist = await Wordlist.findOne()

    const queryBuilder = new WordlistQueryBuilder()
    queryBuilder.ownerId(user?.id!).id(wordlist?.id!).includeWords()
    const [result] = await WordlistRepository.filter(queryBuilder)

    expect(result).not.toBeInstanceOf(Wordlist)

    expect(result.wordsCount).toBeFalsy()
    expect(result.words).toHaveLength(4)
    expect(result.words?.map(word => word.name)).toEqual(expect.arrayContaining(['it', 'works', 'as', 'expected']))

})

it('should be able to add the wordsCount field', async () => {
    const user = await User.findOne()

    const queryBuilder = new WordlistQueryBuilder()
    queryBuilder.ownerId(user?.id!).includeWordsCount()

    const [result] = await WordlistRepository.filter(queryBuilder)

    expect(result.words).toBeFalsy()
    expect(result.wordsCount).toEqual(4)
})

it('user be able to update their own wordlists', async () => {
    const user1 = await User.findOne({where: {email: 'user1@gmail.com'}})
    const wordlist = await Wordlist.findOne()

    const status = await WordlistRepository.update({name: 'NEW NAME'}, wordlist?.id!, user1?.id!)
    expect(status).toBeTruthy()
})

it('user should not be able to update others wordlists', async () => {
    const user1 = await User.findOne({where: {email: 'user1@gmail.com'}})
    const user2 = await User.create({ name: 'another user', email: 'user2@gmail.com', country: 'BR', encryptedPassword: '123' })
    const dto: WordlistDTO = {
        isPrivate: true,
        language: 'en-US',
        name: "USER2's wordlist",
        avatarColor: '#fff',
    }
    const user2Wordlist  = await WordlistRepository.save(dto, user2.id!)

    expect(user2Wordlist.id).toBeTruthy()
    expect(user1?.id).toBeTruthy()
    const status = await WordlistRepository.update({name: 'HACKED'}, user2Wordlist.id!, user1?.id!)
    expect(status).toBeFalsy()
})


it('user be able to DELETE their own wordlists', async () => {
    const user1 = await User.findOne({where: {email: 'user1@gmail.com'}})
    const wordlist = await Wordlist.findOne()

    const status = await WordlistRepository.delete(wordlist?.id!, user1?.id!)
    expect(status).toBeTruthy()
    expect(await Wordlist.count({where: {ownerId: user1?.id!}})).toBe(0)
    expect(await Word.count()).toBe(0)

})
it('user should not be able to DELETE others wordlists', async () => {
    const user1 = await User.findOne({where: {email: 'user1@gmail.com'}})
    const user2 = await User.create({ name: 'another user', email: 'user2@gmail.com', country: 'BR', encryptedPassword: '123' })
    const dto: WordlistDTO = {
        isPrivate: true,
        language: 'en-US',
        name: "USER2's wordlist",
        avatarColor: '#fff',
    }
    const user2Wordlist  = await WordlistRepository.save(dto, user2.id!)

    expect(user2Wordlist.id).toBeTruthy()
    expect(user1?.id).toBeTruthy()
    const status = await WordlistRepository.delete(user2Wordlist.id!, user1?.id!)
    expect(status).toBeFalsy()
})