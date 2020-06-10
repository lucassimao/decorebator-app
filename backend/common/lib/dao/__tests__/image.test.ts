import Database from "../db";
import { Image } from "../image";


beforeEach(async () => {
    Database.connect('sqlite::memory:')
    await Database.instance.createDatabase()
})

afterEach(async () => {
    await Database.instance.disconnect()
})

test("shouldn't accept a invalid url", async () => {
    await expect(Image.create({url: 'Invalid url'})).rejects.toThrow('error');
})

test("should accept a valid url", async () => {
    await expect(Image.create({url: 'xpto.com/abc.jpg'})).resolves.toBeInstanceOf(Image)
    await expect(Image.create({url: 'http://xpto.com.br/abc.jpg'})).resolves.toBeInstanceOf(Image)
})