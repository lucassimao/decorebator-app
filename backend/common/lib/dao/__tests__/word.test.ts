import Database from "../db";
import { Word } from "../word";
import { Image } from "../image";

let database: Database

beforeEach(async () => {
    database = new Database()
    database.connect('sqlite::memory:')
    await database.createDatabase()
})

afterEach(async () => {
    await database.disconnect()
})

test('should be able to create a word with 3 images', async () => {
    const word = await Word.create({name: 'test'})

    const urls= ['xpto.com/img.jpg','xpto.com/abc.jpg','decorabator.com/img.jpg']
    const promises = urls.map(url => word.createImage({url}))
    await Promise.all(promises)
    const totalImages = await Image.count()
    expect(totalImages).toBe(3)
})