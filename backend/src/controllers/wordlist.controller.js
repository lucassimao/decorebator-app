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
    .post('/:id/word', (req, res) => {
        const body = req.body;
        const idWordlist = req.params.id;
        // TODO insert word in the wordlist
    })
    .post('/', async (req, res) => {
        const wordlist = await service.save(req.body);

        res.set('Link', `/wordlists/${wordlist._id}`);
        res.status(201).end()
    })
    .delete('/:id/word/:wordId', (req, res, next) => {
        // TODO remove word from wordlist
    })
    .delete('/:id', (req, res, next) => {
        service.delete(req.params.id);
        res.status(204).send('ok')
        next()
    })
    .patch('/:id', async (req, res) => {
        await service.update(req.params.id,req.body);

        res.set('Link', `/wordlists/${req.params.id}`);
        res.status(204).end()
    })

module.exports = router
