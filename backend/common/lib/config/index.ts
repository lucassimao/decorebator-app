if (!process.env.HTTP_PORT) throw "Http server port must be provided";
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  isDev: env == "development",
  isTest: env == "test",
  isProduction: env == "production",
  defaultPageSize: 10,
  domain: "https://decorebator.com",
  jwtSecretKey: process.env.JWT_SECRET_KEY || "112358132134",
  dbOptions: {},
  dbUrl: process.env.DB_URL,
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

export default Object.assign(baseConfig, envConfig);
