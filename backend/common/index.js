const db = require("./src/db");
const app = require("./src/server");
const config = require("./src/config");
const express = require("express");
const AuthService = require('./src/services/auth.service')

const gracefulExit = async () => {
  await db.disconnect();
  console.log("gracefully exiting ...");
  process.exit(0);
};

function startService(path, router) {
  db.connect().then(() => {
    if (!path.startsWith("/")) path = "/" + path;

    app.use(path, router);
    app.listen(config.port, () => console.log(`${path} endpoint is up and running`));
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
}

async function setupTestEnvironment(path,router,enableSecurity=true){
    await db.connect();
    if (enableSecurity){
        app.use(path, router);
        return app;
    } else {
        if (process.env.NODE_ENV != 'test')
            throw 'Unsecured app is only allowed on testing environment'
        const unsecuredApp = express();
        unsecuredApp.use(path, router);
        return unsecuredApp;
    }
}

module.exports = {
  startService,
  config,
  setupTestEnvironment,
  AuthService
};
