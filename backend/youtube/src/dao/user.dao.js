const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: String,
  country: String,
});

module.exports = mongoose.model("User", User);
