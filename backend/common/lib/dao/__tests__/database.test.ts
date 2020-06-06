import Database from "../db";

test("database creation shouldn't fail", async () => {
    const db = new Database()
    db.connect('sqlite::memory:')
    const modelNames = Object.keys(db.models);
    expect(modelNames).toEqual(expect.arrayContaining(['Image','BinaryExtraction','Word','Wordlist','YoutubeSubtitle','User']));
    await db.createDatabase()
    await db.disconnect()
})