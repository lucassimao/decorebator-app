const express = require("express");
const db = require("./db");
const config = require("./config");
const rootRouter = require("./routers");
const rateLimit = require("express-rate-limit");
const cors = require('cors');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window size: 5 minutes
  max: 50 // 50 requests per windowMs
});

db.connect()
  .then(() => {
    const app = express();

    app.set("trust proxy", 1);
    app.use(cors({ exposedHeaders: 'authorization' }));

    app.use(limiter);
    app.use("/", rootRouter);
    app.listen(config.port);

    console.log("auth is listenning at 3000");
  })
  .catch(console.error);
