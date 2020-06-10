import Database from "../db";
import { Wordlist } from "../wordlist";
import { Word } from "../word";
import { User } from "../user";
import { BinaryExtraction } from "../binaryExtraction";

beforeEach(async () => {
    Database.connect('sqlite::memory:')
    await Database.instance.createDatabase()
})

afterEach(async () => {
    await Database.instance.disconnect()
})

test('should be able to create a wordlist with 4 words', async () => {
    const user = await User.create({name:'Lucas',email: 'xpto@gmail.com',country: 'BR', encryptedPassword: '123'})
    const wordlist = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });

    const promises = ['it', 'works', 'as', 'expected'].map(name => wordlist.createWord({ name }));
    await Promise.all(promises)

    const totalWords = await Word.count()
    expect(totalWords).toBe(4)
})

test('should be able to create a wordlist with binary extraction information', async () => {
    const user = await User.create({name:'Lucas',email: 'xpto@gmail.com',country: 'BR', encryptedPassword: '123'})
    const wordlist = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });

    await wordlist.createBinaryExtraction({extension: 'pdf',size: 1024, extractionMs: 2000})

    const count = await BinaryExtraction.count()
    expect(count).toBe(1)
    const binaryExtraction = await BinaryExtraction.findOne()
    const wordlistBinaryExtraction = await wordlist.getBinaryExtraction() 
    expect(binaryExtraction?.id).toBe(wordlistBinaryExtraction.id)

})