const common = require('decorebator-common')
const WordlistRouter = require('./controllers/wordlist.controller');

common.startService('/wordlists',WordlistRouter)