const request = require('supertest')
const app = require('../../server')
const authService = require('../../services/auth.service');

const wordlist = {
    owner: null,
    description: 'List of words found in the Lord of Rings book',
    name: 'Words - 1',
    language: 'en',
    words: []
} 

// testing the Wordlist restful API
describe("Wordlist's restful API test", () => {

    let jwtToken;

    beforeAll(()=>{
        authService.register('test@gmail.com','12345');
        jwtToken = authService.doLogin('test@gmail.com','12345');
    })

    afterAll(()=>{
        authService.delete('test@gmail.com')
    })

    test("It should answer the GET request with the user's newest wordlists", () => {
        return request(app)
            .get('/wordlists')
            .set('Authorization', `Bearer ${jwtToken}` )
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                expect(Array.isArray(res.body.wordlists)).toBeTruthy()
                expect(res.body.wordlists.length).toBeLessThanOrEqual( WordlistController.PAGE_SIZE )
            })
    })

    
    test('POST to / should return http status 201 if it was able to create a new Wordlist', () => {
        return request(app)
            .post('/wordlists')
            .send(wordlist)
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(async res => {
                const link = res.header['Link']
                const regex = /\/wordlists\/(\S+)-(\d+)$/
                const match = regex.exec(link)
                const id = +match[2]

                const obj = await wordlistService.get(id)
                expect(obj.name).toBe('Words - 1')
            })
    })

    test('PATCH to /:id should return the status 204 if it was able to partially update a wordlist', async () => {
       
        const response = await request(app).post('/wordlists').send(wordlist)
        expect(response.status).toBe(201)

        const link = response.header['Link']
        const regex = /\/wordlist\/(\S+)-(\d+)$/
        const match = regex.exec(link)
        const id = +match[2]

        return request(app)
            .patch(`/wordlist/${id}`)
            .send({
                words: [ 'win', 'growth']
            })
            .expect('Content-Type', /json/)
            .expect(204) 
            .expect(async res => {
                const wordlist = await freelaService.get(id)
                expect(wordlist.words).toBe(['win','growth'])
            })
    })

    test('POST to /:id/words should return the status 204 if it was able to add a new word to a wordlist', async () => {
       
        const response = await request(app).post('/wordlists').send({ ...wordlist, words: ['word1','word2']})
        expect(response.status).toBe(201)

        const link = response.header['Link']
        const regex = /\/wordlist\/(\S+)-(\d+)$/
        const match = regex.exec(link)
        const id = +match[2]

        return request(app)
            .post(`/wordlist/${id}/words`)
            .send({
                words: [ 'win', 'growth']
            })
            .expect('Content-Type', /json/)
            .expect(204) 
            .expect(async res => {
                const wordlist = await freelaService.get(id)
                expect(wordlist.words.length).toBe(4)
            })
    })    


    test('DELETE to /wordlist/:id should return the status 204 if it was able to delete a wordlist', async () => {
        const response = await request(app).post('/wordlist').send(wordlist)
        expect(response.status).toBe(201)

        const link = response.header['Link']
        const regex = /\/wordlist\/(\S+)-(\d+)$/
        const match = regex.exec(link)
        const id = +match[2]

        expect(freelaService.get(id)).not.toBeNull()

        // submting the delete
        const response2 = await request(app).delete(`/wordlist/${id}`)
        expect(response2.status).toBe(204)
        expect(freelaService.get(id)).toBeNull()
    })

    test('DELETE to /:id/words/:id should return the status 204 if it was able to remove a word from the wordlist', async () => {
       
        const response = await request(app).post('/wordlists').send({ ...wordlist, words: ['word1','word2']})
        expect(response.status).toBe(201)

        const link = response.header['Link']
        const regex = /\/wordlist\/(\S+)-(\d+)$/
        const match = regex.exec(link)
        const id = +match[2]

        return request(app)
            .delete(`/wordlist/${id}/words/0`)
            .expect('Content-Type', /json/)
            .expect(204) 
            .expect(async res => {
                const wordlist = await freelaService.get(id)
                expect(wordlist.words).toBe(['word2'])
            })
    })     
})
