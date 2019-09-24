const mongoose = require("mongoose");
const validator = require("validator");
var fs = require("fs");

var countriesCode = JSON.parse(fs.readFileSync(__dirname + "/../resources/countries.json", "utf8")).map(
  country => country["alpha-2"]
);

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: [validator.isEmail, "A valid email must be used as your account login"]
    },
    country: { type: String, required: true, enum: countriesCode },
    encrypted_password: String,
    dateCreated: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model("User", User);
