const request = require('supertest')
const app = require('../../server')
const authService = require('../../services/auth.service');
const wordlistService = require('../../services/wordlist.service')
const conf = require('../../config');
const db = require('../../db')

const PAGE_SIZE = conf.defaultPageSize;
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

    beforeAll(async () => {
        await db.connect();
        await authService.register('test@gmail.com', '12345');
        jwtToken = await authService.doLogin('test@gmail.com', '12345');
    })

    afterAll(async () => {
        await authService.removeAccount('test@gmail.com')
        await db.disconnect();
    })

    it('should return a 401 status code for any non authenticated request', async () => {

        const getResponse = await request(app).get('/wordlists')
        expect(getResponse.status).toBe(401)

        const postResponse = await request(app).post('/wordlists').send(wordlist)
        expect(postResponse.status).toBe(401)

    })

    it("A GET request to /wordlits returns an user's newest wordlists", (done) => {
        request(app)
            .get('/wordlists')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(200,{wordlists: []},done)
    })

    it('should return http status 201 if it was able to create a new wordlist after a POST request', (done) => {
        request(app)
            .post('/wordlists')
            .set('Authorization', `Bearer ${jwtToken}` )
            .send(wordlist)
            .expect(201,{})
            .end(async (error,res) => {
                if (error)
                    return done(error);

                const link = res.header['link']
                const regex = /\/wordlists\/(\S+)$/
                const match = regex.exec(link)
                const id = match[1]

                const obj = await wordlistService.get(id)
                expect(obj.name).toBe('Words - 1')
                
                return done();
            })
    })

    
    it('should return the status 204 if it was able to partially update a wordlist after a PATCH request', async (done) => {
       
        const object = await wordlistService.save(wordlist)

        request(app)
            .patch(`/wordlists/${object._id}`)
            .set('Authorization', `Bearer ${jwtToken}` )
            .send({
                name: 'My wordlist'
            })
            .expect(204,{}) 
            .end(async (error,res) => {
                if (error){
                    return done(error);
                }
                
                const wordlist = await wordlistService.get(object._id)
                expect(wordlist.name).toBe('My wordlist')

                return done();
            })
    })

    it('should return status 204 if it was able to add a new word to a wordlist after POST to /wordlists/:id/words', async (done) => {

        const object = await wordlistService.save({...wordlist, words: [{name: 'success'}]})

        return request(app)
            .post(`/wordlists/${id}/words`)
            .set('Authorization', `Bearer ${jwtToken}` )
            .send({
                name: 'winner'
            })
            .expect('Content-Type', /json/)
            .expect(204) 
            .end(async (err,res) => {
                if (err)
                    return done(err);

                const wordlist = await wordlistService.get(object._id)
                expect(wordlist.words.length).toBe(2)
                return done();
            })
    })    


    test('DELETE to /wordlist/:id should return the status 204 if it was able to delete a wordlist', async () => {
       const object = await wordlistService.save({...wordlist, words: [{name: 'success'}]})

        expect(wordlistService.get(object._id)).not.toBeNull()

        const response = await request(app)
            .set('Authorization', `Bearer ${jwtToken}` )
            .delete(`/wordlists/${id}`);

        expect(response.status).toBe(204)
        expect(wordlistService.get(object._id)).toBeNull()
    })

    test('DELETE to /wordlist/:id/words/:id should return the status 204 if it was able to remove a word from a wordlist', async () => {
       
        const object = await wordlistService.save({...wordlist, words: [{name: 'success'}]})
    
        const response = await request(app).delete(`/wordlists/${id}/words/0`).set('Authorization', `Bearer ${jwtToken}` )
        expect(response.status).toBe(204)
        expect(wordlistService.get(object._id).words.length).toBe(0)
    })     
    
})
