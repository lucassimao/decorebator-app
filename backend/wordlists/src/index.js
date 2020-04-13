const server = require("./server");
const db = require("./db");
const { port, logger } = require("./config");

db.connect()
  .then(() => {
    server.listen(port);
    logger.info(`wordlists is listenning at ${port}`);
  })
  .catch(logger.error);
