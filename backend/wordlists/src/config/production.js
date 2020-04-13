if (!process.env.MONGO_DB_URL) throw "Mongo db url was not provided!";
if (!process.env.HTTP_PORT) throw "Http server port must be provided!";

if (!process.env.JWT_SECRET_KEY)
  throw "Jwt secret key must be provided as an environment variable in production";

module.exports = {
  httpDomain: `https://decorebator.com`
};
