import Database from '../../db'
import { User } from '../../entities/user'
import { Word } from '../../entities/word'
import { Wordlist } from '../../entities/wordlist'
import WordRepository from '../word.repository'
import { UserRepository } from '../..'

beforeEach(async () => {
    await Database.connect('sqlite::memory:')
    await Database.instance.sync()

    const user = await User.create({ name: 'Lucas', email: 'user1@gmail.com', country: 'BR', encryptedPassword: '123' })
    const wordlist = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });

    const promises = ['it', 'works', 'as', 'expected'].map(async (name,index) => {
        const word = await wordlist.createWord({ name })
        const imgAttrs = { url: `http://foo-cdn.com/decorebator/${index}`, description: `Image for ${name}` }
        await word.createImage(imgAttrs)
        return word
    });

    const user2 = await User.create({ name: 'Lucas 2', email: 'user2@gmail.com', country: 'BR', encryptedPassword: '123' })
    const wordlist2 = await Wordlist.create({
        isPrivate: true,
        description: 'xpto 2',
        language: 'en-US',
        name: 'wordlist 456',
        avatarColor: '#fff',
        ownerId: user2.id
    });

    const promises2 = ['never', 'bet', 'against', 'america'].map(name => wordlist2.createWord({ name }));
    await Promise.all([...promises, ...promises2])
})

afterEach(async () => {
    await Database.instance.disconnect()
})

test('test getById', async () => {
    const user = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]
    const word = await Word.findOne({ where: { name: 'expected' } })

    //@ts-ignore
    const result = await WordRepository.getById(wordlist?.id, word?.id, user?.id)
    expect(Object.keys(result ?? {})).toHaveLength(3)
    expect(Object.keys(result ?? {})).toEqual(expect.arrayContaining(['id', 'name', 'wordlistId']))
    //@ts-ignore
    expect(result.name).toEqual('expected')
})

test('test getByIdWithImage', async () => {
    const user = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const wordlist = await Wordlist.findOne({where: {name: 'wordlist 123'}})
    const word = await Word.findOne({ where: { name: 'expected', wordlistId: wordlist?.id! } })

    const result = await WordRepository.getByIdWithImages(wordlist?.id!,word?.id!,user?.id!)
    expect(result?.images).toHaveLength(1)
    expect(result?.images![0].description).toEqual(`Image for expected`)
})

test('test getWordsFromWordlist', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]

    //@ts-ignore
    const results = await WordRepository.getWordsFromWordlist(wordlist?.id, user?.id) ?? []
    expect(results).toHaveLength(4)
    //@ts-ignore
    expect(results.map(({ name }) => name)).toEqual(expect.arrayContaining(['never', 'bet', 'against', 'america']))
})


test('test getWordsFromWordlist using  wrong owner ', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })

    const wordlist = (await user1?.getWordlists() ?? [])[0]

    //@ts-ignore
    const results = await WordRepository.getWordsFromWordlist(wordlist?.id, user2?.id)
    expect(results).toHaveLength(0)
})

test('test createWord', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]

    //@ts-ignore
    await WordRepository.createWord(wordlist?.id, 'awesome', user?.id)
    expect(await UserRepository.getAllWords(user?.id!)).toEqual(['against', 'america', 'awesome', 'bet', 'never'])
})

test('test createWord with wrong user', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user1?.getWordlists() ?? [])[0]

    //@ts-ignore
    await WordRepository.createWord(wordlist?.id, 'awesome', user2?.id)
    expect(await UserRepository.getAllWords(user1?.id!)).toEqual(['as', 'expected', 'it', 'works'])
})


test('test updateWord', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'america')

    //@ts-ignore
    await WordRepository.updateWord('AMERICA', wordlist.id, word.id, user.id)
    expect(await UserRepository.getAllWords(user?.id!)).toEqual(['AMERICA', 'against', 'bet', 'never'])
})

test('test updateWord with wrong user', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user2?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'america')

    //@ts-ignore
    await WordRepository.updateWord('AMERICA', wordlist.id, word.id, user1.id)
    expect(await UserRepository.getAllWords(user2?.id!)).toEqual(['against', 'america', 'bet', 'never'])
})

test('test deleteWord', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'bet')

    //@ts-ignore
    await WordRepository.deleteWord(wordlist.id, word?.id, user?.id)
    expect(await UserRepository.getAllWords(user?.id!)).toEqual(['against', 'america', 'never'])
})

test('test deleteWord with wrong user', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user2?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'bet')

    //@ts-ignore
    await WordRepository.deleteWord(wordlist.id, word?.id, user1?.id)
    expect(await UserRepository.getAllWords(user2?.id!)).toEqual(['against', 'america', 'bet', 'never'])
})
