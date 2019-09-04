const common = require('decorebator-common')
const WordlistRouter = require('./routers/wordlist.router');

common.startService('/wordlists',WordlistRouter)