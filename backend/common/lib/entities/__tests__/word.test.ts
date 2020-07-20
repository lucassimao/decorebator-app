import Database from "../../db";
import { Image } from "../image";
import { User } from "../user";
import { Word } from "../word";
import { Wordlist } from "../wordlist";

beforeEach(async () => {
    await Database.connect('sqlite::memory:')
})

afterEach(async () => {
    await Database.instance.disconnect()
})

test('should be able to create a word with 3 images', async () => {
    const word = await Word.create({name: 'test'})

    const urls= ['xpto.com/img.jpg','xpto.com/abc.jpg','decorabator.com/img.jpg']
    const promises = urls.map(url => word.createImage({url}))
    await Promise.all(promises)
    const totalImages = await Image.count()
    expect(totalImages).toBe(3)
})

test('should be able to make the relationship with Wordlist', async() => {
    const user = await User.create({name:'Lucas',email: 'xpto@gmail.com',country: 'BR', encryptedPassword: '123'})
    const wordlist = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });

    const word = await Word.create({name: 'test',wordlistId: wordlist.id})
    const object = await word.getWordlist()
    expect(object.id).toBe(wordlist.id)
})