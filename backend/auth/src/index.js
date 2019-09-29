const express = require("express");
const db = require("./db");
const config = require('./config')
const rootRouter = require("./routers");

db.connect()
  .then(() => {

    const app = express();
    app.use("/", rootRouter);
    app.listen(config.port);

    console.log('auth is listenning at 3000');
  })
  .catch(console.error);
