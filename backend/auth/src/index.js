const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");
const { default: logger } = require("./logger");
const { initDB } = require("./db");
const { getConnection } = require("typeorm");

if (!process.env.PORT) {
  throw new Error("env PORT not found");
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window size: 5 minutes
  max: 50, // 50 requests per windowMs
});

const app = express();

app.set("trust proxy", 1);
app.use(cors({ exposedHeaders: "authorization" }));

app.use(limiter);
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev", { immediate: true }));
}

let server = null;

const stopApp = async (info) => {
  logger.error("stoping server...", info);

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
  const rootRouter = require("./routers");
  app.use("/", rootRouter);
  server = app.listen(process.env.PORT);
  logger.info(`auth is listenning at ${process.env.PORT}`);
}

process.once("SIGUSR2", stopApp);
process.once("uncaughtException", stopApp);
process.once("unhandledRejection", stopApp);

init();
