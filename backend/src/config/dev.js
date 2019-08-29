DEV_SERVER_PORT = 3000;

module.exports = {
    dbUrl: 'mongodb://localhost:27017/decorebator',
    port: DEV_SERVER_PORT,
    httpDomain: `http://localhost:${DEV_SERVER_PORT}`,
    dbOptions : { useNewUrlParser: true ,auto_reconnect: true}
}
