const app = require('./server')
const config = require('./config')
const db = require('./db')

db.connect()
    .then(() =>
        app.listen(config.port, () => console.log("decorebator's backend is up and running"))
    )


const gracefulExit = async () => {
    await db.disconnect()
    console.log('gracefully exiting ...');
    process.exit(0)
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit)
    .on('SIGTERM', gracefulExit)
