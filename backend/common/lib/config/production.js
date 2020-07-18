const winston = require("winston");

if (!process.env.JWT_SECRET_KEY)
  throw "Jwt secret key must be provided as an environment variable in production";

const transports = [];
transports.push(
  new winston.transports.Console({
    format: winston.format.simple(),
    level: "info"
  })
);

const logger = winston.createLogger({
  format: winston.format.json(),
  transports
});

module.exports = {
  httpDomain: `https://decorebator.com`,
  logger,
  jwtExpiration: 3600, // 1 hour
};
