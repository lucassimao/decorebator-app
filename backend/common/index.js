const db = require("./src/db");
const setupServer = require("./src/server");
const config = require("./src/config");
const AuthService = require("./src/services/auth.service");


function startService(path, router, enableSecurity = true) {
  db.connect().then(() => {
    if (!path.startsWith("/")) path = "/" + path;

    const app = setupServer(enableSecurity);
    app.use(path, router);
    app.listen(config.port, () => console.log(`${path} endpoint is up and running`));
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
}

async function setupTestEnvironment(path, router, enableSecurity = true) {
  await db.connect();
  const app = setupServer(enableSecurity);
  app.use(path, router);
  return app;
}

const gracefulExit = async () => {
  await db.disconnect();
  console.log("gracefully exiting ...");
  process.exit(0);
};

module.exports = {
  startService,
  config,
  setupTestEnvironment,
  AuthService
};
