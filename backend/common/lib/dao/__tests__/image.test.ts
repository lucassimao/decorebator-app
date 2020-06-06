import Database from "../db";
import { Image } from "../image";

let database: Database;

beforeEach(async () => {
    database = new Database()
    database.connect('sqlite::memory:')
    await database.createDatabase()
})

afterEach(async () => {
    await database.disconnect()
})

test("shouldn't accept a invalid url", async () => {
    await expect(Image.create({url: 'Invalid url'})).rejects.toThrow('error');
})

test("should accept a valid url", async () => {
    await expect(Image.create({url: 'xpto.com/abc.jpg'})).resolves.toBeInstanceOf(Image)
    await expect(Image.create({url: 'http://xpto.com.br/abc.jpg'})).resolves.toBeInstanceOf(Image)
})