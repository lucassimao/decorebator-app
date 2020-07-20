const express = require("express");
const { config, Database } = require("@lucassimao/decorabator-common");
const rootRouter = require("./routers");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window size: 5 minutes
  max: 50 // 50 requests per windowMs
});


Database.connect(config.dbUrl)
  .then(() => {
    const app = express();

    app.set("trust proxy", 1);
    app.use(cors({ exposedHeaders: "authorization" }));

    app.use(limiter);
    app.use(
      config.isDev ? morgan("dev", { immediate: true }) : morgan("combined")
    );
    app.use("/", rootRouter);
    const server = app.listen(config.port);

    config.logger.info(`auth is listenning at ${process.env.HTTP_PORT}`);

    process.once("SIGUSR2", async () => {
      await Database.instance.disconnect()
      if (server) {
        server.close()
      }
    });

  })
  .catch(config.logger.error);
