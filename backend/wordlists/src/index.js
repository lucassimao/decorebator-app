const server = require("./server");
const db = require("./db");
const config = require("./config");

db.connect()
  .then(() => {
    server.listen(config.port);
    console.log(`wordlists is listenning at ${config.port}`);
  })
  .catch(console.error);
