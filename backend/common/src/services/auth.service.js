const bcrypt = require("bcrypt");
const jwtBuilder = require("jwt-builder");
const UserDao = require("../dao/user.dao");
const config = require("../config");

// all methods return promises

const register = (email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  }).then(encrypted_password => UserDao.create({ email, encrypted_password }));
};

const doLogin = (email, password) => {
  return UserDao.findOne({ email }, "encrypted_password")
    .exec()
    .then(user => {
      const doesMatch = bcrypt.compareSync(password, user.encrypted_password);
      if (doesMatch) {
        return user;
      } else {
        throw "wrong password";
      }
    })
    .then(user => {
      return jwtBuilder({
        algorithm: "HS256",
        secret: config.jwtSecretKey,
        iat: true,
        nbf: true,
        exp: 3600,
        iss: config.domain,
        userId: user._id,
        headers: {
          header1: "ok"
        },
        claims: {
          claim1: "ok"
        }
      });
    });
};

const removeAccount = email => UserDao.deleteOne({ email });

module.exports = { register, doLogin, removeAccount };
