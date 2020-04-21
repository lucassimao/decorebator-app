const winston = require("winston");
require("winston-daily-rotate-file");

const env = process.env.NODE_ENV || "development";
if (!process.env.MONGO_DB_URL) throw "Mongo db url was not provided!";

var dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "decorebator-metadata-%DATE%.log",
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
  domain: "https://decorebator.com",
  jwtSecretKey: process.env.JWT_SECRET_KEY || "112358132134",
  db: {
    options: {
      useNewUrlParser: true,
      auto_reconnect: true,
      useUnifiedTopology: true
    },
    url: process.env.MONGO_DB_URL,
  },
  port: process.env.HTTP_PORT || 4000
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

let finalConfig = baseConfig;

if (envConfig.db)
finalConfig = {
    ...baseConfig,
    db: {
      ...baseConfig.db, ...envConfig.db,
      options: { ...baseConfig.db.options, ...envConfig.db.options }
    }
  }

module.exports = finalConfig;
