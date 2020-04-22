const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = {
  domain: "https://test.decorebator.com",
  logger
};
