const app = require("./app");

const { Database, config: {port,logger,dbUrl} } = require('@lucassimao/decorabator-common')

Database
  .connect(dbUrl)
  .then(async (database) => {
    // await database.sync()
    const server = app.listen(port);

    process.once("SIGUSR2", async () => {
      await Database.instance.disconnect()
      if (server) {
        server.close()
      }
    });

    logger.info(`wordlists is listenning at ${port}`);
  })
  .catch(logger.error);
