import Database from "../db";

test("database creation shouldn't fail", async () => {
    const db = await Database.connect('sqlite::memory:')
    await db.sync()
    const modelNames = Object.keys(db.models);
    expect(modelNames).toEqual(expect.arrayContaining(['Image','BinaryExtraction','Word','Wordlist','YoutubeSubtitle','User']));
    await db.disconnect()
})