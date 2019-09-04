const common = require('decorebator-common')
const rootRouter = require('./routers');

common.startService('/',rootRouter)