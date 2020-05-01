const mongoose = require("mongoose");
const process = require("process");
const config = require("./config");

let isConnected = false;
const logger = config.logger;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connection.on("error", error => {
  logger.error("There was a problem establishing db connection");
  logger.error(error);
  process.exit(-1);
});

mongoose.connection.on("disconnected", function() {
  logger.debug("Mongoose default connection to DB disconnected");
  isConnected = false;
});

mongoose.connection.once("open", function() {
  logger.debug("MongoDB connection is open! ");
  isConnected = true;
});

process.once('SIGUSR2', function () {
  mongoose.connection.close(() => process.kill(process.pid, 'SIGUSR2'));
});

module.exports = {
  connect: async () => {
    if (!isConnected) await mongoose.connect(config.db.url, config.db.options);
  },
  disconnect: async callback => {
    if (isConnected) await mongoose.connection.close(callback);
  }
};
