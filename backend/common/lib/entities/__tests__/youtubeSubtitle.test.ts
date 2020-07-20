import Database from "../../db";
import { YoutubeSubtitle } from "../youtubeSubtitle";

beforeEach(async () => {
    await Database.connect('sqlite::memory:')
})

afterEach(async () => {
    await Database.instance.disconnect()
})

test("shouldn't accept a invalid download url", async () => {
    await expect(YoutubeSubtitle.create({ downloadUrl: 'Invalid url', videoId: '123', languageCode: 'en-uk', languageName: 'English', isAutomatic: false }))
    .rejects.toThrow('error');
})