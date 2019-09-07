const request = require('supertest');
const { AuthService, setupTestEnvironment } = require("decorebator-common");

const rootRouter = require("../../routers");
const fsPromises = require("fs").promises;
const subtitleService = require("../../services/subtitle.service");


describe('Test for the endpoint that receives public subtitles', () => {
    let app, jwtToken;

    beforeAll(async () => {
        app = await setupTestEnvironment("/", rootRouter, true);
        jwtToken = await AuthService.doLogin("teste@gmail.com", "112358");
    });

    afterAll(async () => {
        await AuthService.removeAccount("teste@gmail.com");
    });

    it('should respond with status 201 after a POST request', async (done) => {

        const base64Content = await loadAsBase64(`${__dirname}/fixtures/Why sitting is bad for you - Murat Dalkilinç - English.srt`);
        const description = 'Why sitting is bad for you - Murat Dalkilinç';
        const lang = 'english', type = 'youtube', videoUrl = 'https://www.youtube.com/watch?v=wUEl8KrMz14';

        request(app)
            .post(`/subtitles`)
            .set("authorization", `Bearer ${jwtToken}`)
            .set("content-type", "application/json")
            .send({ base64Content, description, lang, type, videoUrl })
            .expect(201, {})
            .expect("link", new RegExp(`/subtitles/(\\S{24})$`))
            .end(async (err, res) => {
                if (err) return done(err);

                const link = res.header["link"];
                const regex = /\/subtitles\/(\S+)$/;
                const match = regex.exec(link);
                const id = match[1];

                const subtitle = await subtitleService.get(id);
                expect(subtitle.description).toBe(description);
                expect(subtitle.source).toBe(source);
                expect(subtitle.type).toBe(type);
                expect(subtitle.tracks).toHaveLength(79)

                return done();
            });


    })
})

async function loadAsBase64(filename) {
    let fileHandle, base64Image;
    try {
        fileHandle = await fsPromises.open(filename, "r");
        const buffer = await fileHandle.readFile();
        base64Image = buffer.toString("base64");
        return base64Image;
    } finally {
        if (fileHandle) fileHandle.close();
    }
}