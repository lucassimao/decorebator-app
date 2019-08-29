const express = require('express')
const service = require('../services/wordlist.service')

const router = express.Router()

router
    .get('/',  async (req, res) => {
        const user = req.user;
        const {page = 0} = req.query;

        const wordlists = await service.list(user,{page})
        res.status(200).send({ wordlists })
    })
    .post('/:id/words', async (req, res) => {
        const body = req.body;
        const idWordlist = req.params.id;

        const updatedWordlist = await service.addWord(idWordlist,body)
        if (updatedWordlist){
            res.set('Link', `/wordlists/${idWordlist}/words/${updatedWordlist.words.length-1}`);
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    })
    .post('/', async (req, res) => {
        const wordlist = await service.save(req.body);

        res.set('Link', `/wordlists/${wordlist._id}`);
        res.status(201).end()
    })
    .delete('/:id/words/:wordId', async (req, res) => {
        const dbResponse = await service.deleteWord(req.params.id,req.params.wordId)

        if (dbResponse.ok === 1 && dbResponse.nModified === 1){
            res.status(204).end()
        } else {
            res.status(404).end()
        }        
    })
    .delete('/:id', async (req, res) => {
        const dbResponse = await service.delete(req.params.id)

        if (dbResponse.ok === 1 && dbResponse.deletedCount === 1){
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    })
    .patch('/:id', async (req, res) => {
        await service.update(req.params.id,req.body);

        res.set('Link', `/wordlists/${req.params.id}`);
        res.status(204).end()
    })

module.exports = router
