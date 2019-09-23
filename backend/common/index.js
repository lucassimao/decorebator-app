const db = require("./src/db");
const config = require("./src/config");


const gracefulExit = async () => {
  await db.disconnect();
  console.log("gracefully exiting ...");
  process.exit(0);
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);


module.exports = {
  config,
  db
};
