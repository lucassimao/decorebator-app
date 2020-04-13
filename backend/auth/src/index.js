const express = require("express");
const db = require("./db");
const config = require("./config");
const rootRouter = require("./routers");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window size: 5 minutes
  max: 50 // 50 requests per windowMs
});

db.connect()
  .then(() => {
    const app = express();

    app.set("trust proxy", 1);
    app.use(cors({ exposedHeaders: "authorization" }));

    app.use(limiter);
    app.use(
      config.isDev ? morgan("dev", { immediate: true }) : morgan("combined")
    );
    app.use("/", rootRouter);
    app.listen(config.port);

    config.logger.info(`auth is listenning at ${process.env.HTTP_PORT}`);
  })
  .catch(config.logger.error);
