import Database from '../../db'
import { User } from '../../entities/user'
import { Word } from '../../entities/word'
import { Wordlist } from '../../entities/wordlist'
import WordService from '../word.repository'

beforeEach(async () => {
    Database.connect('sqlite::memory:')
    await Database.instance.createDatabase()

    const user = await User.create({ name: 'Lucas', email: 'user1@gmail.com', country: 'BR', encryptedPassword: '123' })
    const wordlist = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });

    const promises = ['it', 'works', 'as', 'expected'].map(name => wordlist.createWord({ name }));

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
    const result = await WordService.getById(wordlist?.id, word?.id, user?.id)
    expect(Object.keys(result ?? {})).toHaveLength(4)
    expect(Object.keys(result ?? {})).toEqual(expect.arrayContaining(['id', 'name', 'wordlistId', 'createdAt']))
    //@ts-ignore
    expect(result.name).toEqual('expected')
})

test('test getAllWordsFromWordlist', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]

    //@ts-ignore
    const results = await WordService.getAllWordsFromWordlist(wordlist?.id, user?.id) ?? []
    expect(results).toHaveLength(4)
    //@ts-ignore
    expect(results.map(({ name }) => name)).toEqual(expect.arrayContaining(['never', 'bet', 'against', 'america']))
})


test('test getAllWordsFromWordlist using  wrong owner ', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })

    const wordlist = (await user1?.getWordlists() ?? [])[0]

    //@ts-ignore
    const results = await WordService.getAllWordsFromWordlist(wordlist?.id, user2?.id)
    expect(results).toHaveLength(0)
})

test('test createWord', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]

    //@ts-ignore
    await WordService.createWord(wordlist?.id, 'awesome', user?.id)
    expect(await user?.getAllWords()).toEqual(['against', 'america', 'awesome', 'bet', 'never'])
})

test('test createWord with wrong user', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user1?.getWordlists() ?? [])[0]

    //@ts-ignore
    await WordService.createWord(wordlist?.id, 'awesome', user2?.id)
    expect(await user1?.getAllWords()).toEqual(['as', 'expected', 'it', 'works'])
})


test('test updateWord', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'america')

    //@ts-ignore
    await WordService.updateWord('AMERICA', wordlist.id, word.id, user.id)
    expect(await user?.getAllWords()).toEqual(['AMERICA', 'against', 'bet', 'never'])
})

test('test updateWord with wrong user', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user2?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'america')

    //@ts-ignore
    await WordService.updateWord('AMERICA', wordlist.id, word.id, user1.id)
    expect(await user2?.getAllWords()).toEqual(['against', 'america', 'bet', 'never'])
})

test('test deleteWord', async () => {
    const user = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'bet')

    //@ts-ignore
    await WordService.deleteWord(wordlist.id, word?.id, user?.id)
    expect(await user?.getAllWords()).toEqual(['against', 'america', 'never'])
})

test('test deleteWord with wrong user', async () => {
    const user1 = await User.findOne({ where: { email: 'user1@gmail.com' } })
    const user2 = await User.findOne({ where: { email: 'user2@gmail.com' } })
    const wordlist = (await user2?.getWordlists() ?? [])[0]
    const words = await wordlist.getWords()
    const word = words.find(({ name }) => name === 'bet')

    //@ts-ignore
    await WordService.deleteWord(wordlist.id, word?.id, user1?.id)
    expect(await user2?.getAllWords()).toEqual(['against', 'america', 'bet', 'never'])
})
