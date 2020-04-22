if (!process.env.MONGO_DB_URL) throw "Mongo db url was not provided!";
if (!process.env.HTTP_PORT) throw "Http server port must be provided!";


const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
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
