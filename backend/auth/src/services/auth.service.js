const { getRepository } = require("typeorm");
const { default: User } = require("../entities/user");
const bcrypt = require("bcrypt");
const jwtBuilder = require("jwt-builder");

if (!process.env.JWT_SECRETE_KEY) {
  throw new Error("env JWT_SECRETE_KEY not found");
}

if (!process.env.JWT_EXPIRATION) {
  throw new Error("env JWT_EXPIRATION not found");
}

const isStringEmpty = (string) => !string || string.trim().length == 0;
const repository = getRepository(User);
/**
 *
 * @param {String} name User full name
 * @param {String} country User country
 * @param {String} email User email. It'll be used as his login
 * @param {String} password User password. The plain password won't be stored, It'll be hashed
 *
 * @returns {Promise} Promise to be resolved to the new user registered on the database
 */
const register = async (name, country, email, password) => {
  if (isStringEmpty(password)) {
    throw new Error("A password must be provided");
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  return repository.save({ name, country, email, encryptedPassword });
};

/**
 *
 * @param {String} email User email, used as username
 * @param {String} password User password
 *
 * @returns {Promise} Promise to be resolved to the jwt token that will allow the user to send authenticated requests
 */
const doLogin = async (email, password) => {
  if (isStringEmpty(email) || isStringEmpty(password)) {
    throw new Error("Login and password must be provided");
  }
  const user = await repository.findOne({ where: { email } });
  const doesMatch = await bcrypt.compare(password, user?.encryptedPassword);

  if (doesMatch) {
    return jwtBuilder({
      algorithm: "HS256",
      secret: process.env.JWT_SECRETE_KEY,
      iat: true,
      nbf: true,
      exp: process.env.JWT_EXPIRATION,
      iss: "auth.decorebator.com",
      audience: "decorebator.com",
      userId: user.id,
      claims: {
        role: "user",
      },
    });
  } else {
    throw "inexisting user or wrong password";
  }
};

const removeAccount = (email) => repository.delete({ where: { email } });

module.exports = { register, doLogin, removeAccount };
