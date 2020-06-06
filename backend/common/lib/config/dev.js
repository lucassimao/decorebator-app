const winston = require("winston");
require("winston-daily-rotate-file");

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "decorebator-%DATE%.log",
  level: "info",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "10d"
});

const transports = [];
transports.push(dailyRotateFileTransport);
transports.push(
  new winston.transports.Console({
    format: winston.format.simple(),
    level: "silly"
  })
);

const logger = winston.createLogger({
  format: winston.format.json(),
  transports
});

module.exports = {
  httpDomain: `http://localhost:${process.env.HTTP_PORT}`,
  logger
};
