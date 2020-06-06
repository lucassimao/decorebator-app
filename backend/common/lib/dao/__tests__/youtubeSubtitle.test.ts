import Database from "../db";
import { YoutubeSubtitle } from "../youtubeSubtitle";

let database: Database;

beforeEach(async () => {
    database = new Database()
    database.connect('sqlite::memory:')
    await database.createDatabase()
})

afterEach(async () => {
    await database.disconnect()
})

test("shouldn't accept a invalid download url", async () => {
    await expect(YoutubeSubtitle.create({ downloadUrl: 'Invalid url', videoId: '123', languageCode: 'en-uk', languageName: 'English', isAutomatic: false }))
    .rejects.toThrow('error');
})