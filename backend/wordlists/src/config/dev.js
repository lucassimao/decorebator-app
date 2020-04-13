if (!process.env.MONGO_DB_URL) throw "Mongo db url was not provided!";
if (!process.env.HTTP_PORT) throw "Http server port must be provided!";

module.exports = {
  httpDomain: `http://localhost:${process.env.HTTP_PORT}`
};
