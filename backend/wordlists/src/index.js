const { initDB } = require("./db");
const logger = require("./logger").default;
const { getConnection } = require("typeorm");

if (!process.env.PORT) {
  throw new Error("env variable PORT not found");
}

let server = null;

const stopApp = async error => {
  logger.error('stopping server ...', error);

  const connection = getConnection();
  if (connection?.isConnected) {
    await connection.close();
  }
  if (server) {
    server.close();
  }
  process.exit(-1);
};

async function init() {
  await initDB();
  const app = require("./app");
  server = app.listen(process.env.PORT);
  logger.info(`wordlist is listenning at ${process.env.PORT}`);
}

process.once("SIGUSR2", stopApp);
process.once("uncaughtException", stopApp);
process.once("unhandledRejection", stopApp);

init();
