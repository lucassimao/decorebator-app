const winston = require("winston");
require("winston-daily-rotate-file");

const env = process.env.NODE_ENV || "development";

if (!process.env.MONGO_DB_URL) throw "Mongo db url was not provided!";
if (!process.env.HTTP_PORT) throw "Http server port must be provided!";


if (env == "production" && !process.env.JWT_SECRET_KEY)
  throw "Jwt secret key must be provided as an environment variable in production";

var dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "decorebator-wordlists-%DATE%.log",
  level: 'info',
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "10d"
});

var transports = [dailyRotateFileTransport]
if (process.env.SHOW_LOG_ON_STDOUT) {
  transports.push(new winston.transports.Console({ format: winston.format.simple(), level: 'silly' }))
}

const logger = winston.createLogger({
  format: winston.format.json(),
  transports
});

const baseConfig = {
  env,
  logger,
  isDev: env == "development",
  isTest: env == "test",
  defaultPageSize: 10,
  domain: "https://decorebator.com",
  jwtSecretKey: process.env.JWT_SECRET_KEY || "112358132134",
  dbOptions: {
    useNewUrlParser: true,
    auto_reconnect: true,
    useUnifiedTopology: true
  },
  dbUrl: process.env.MONGO_DB_URL,
  port: process.env.HTTP_PORT,
  httpOptions: {
    enableCompression: process.env.ENABLE_COMPRESSION == "true"
  }
};

let envConfig = {};

switch (env) {
  case "development":
    envConfig = require("./dev");
    break;
  case "test":
    envConfig = require("./testing");
    break;
  case "production":
    envConfig = require("./production");
}

module.exports = Object.assign(baseConfig, envConfig);
