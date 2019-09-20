const mongoose = require("mongoose");
var fs = require("fs");

var countriesCode = JSON.parse(fs.readFileSync(__dirname + "/../countries.json", "utf8")).map(
  country => country["alpha-2"]
);
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true, enum: countriesCode },
  encrypted_password: String,
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", User);
