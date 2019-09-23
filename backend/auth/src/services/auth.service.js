const bcrypt = require("bcrypt");
const jwtBuilder = require("jwt-builder");
const UserDao = require("../dao/user.dao");
const {config} = require("decorebator-common");

/**
 *
 * @param {String} name User full name
 * @param {String} country User country
 * @param {String} email User email. It'll be used as his login
 * @param {String} password User password. The plain password won't be stored, It'll be hashed
 *
 * @returns {Promise} Promise to be resolved to the new user registered on the database
 */
const register = (name, country, email, password) => {
  if (isStringEmpty(password)) {
    return Promise.reject("A password must be provided");
  }

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  }).then(encrypted_password => UserDao.create({ name, country, email, encrypted_password }));
};

/**
 *
 * @param {String} email User email, used as username
 * @param {String} password User password
 *
 * @returns {Promise} Promise to be resolved to the jwt token that will allow the user to send authenticated requests
 */
const doLogin = (email, password) => {
  if (isStringEmpty(email) || isStringEmpty(password)) {
    return Promise.reject("Login and password must be provided");
  }

  return UserDao.findOne({ email }, "encrypted_password")
    .exec()
    .then(user => {
      if (!user) {
        throw "user not found";
      }
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
        claims: {
          role: "user"
        }
      });
    });
};

// TODO use validator library
const isStringEmpty = string => !string || string.trim().length == 0;

const removeAccount = email => UserDao.deleteMany({ email });

module.exports = { register, doLogin, removeAccount };
