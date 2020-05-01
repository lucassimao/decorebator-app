const env = process.env.NODE_ENV || "development";
if (!process.env.MONGO_DB_URL) throw "Mongo db url was not provided!";

const baseConfig = {
  env,
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

let finalConfig = Object.assign(baseConfig, envConfig);

if (envConfig.db) {
  finalConfig = {
    ...baseConfig,
    db: {
      ...baseConfig.db, ...envConfig.db,
      options: { ...baseConfig.db.options, ...envConfig.db.options }
    }
  }
}

module.exports = finalConfig;
