const jwt = require("jsonwebtoken");
const { AuthenticationError, ApolloError } = require("apollo-server");
const { getRepository } = require("typeorm");
const { default: User } = require("../entities/user");
const { default: logger } = require("../logger");

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("env JWT_SECRET_KEY not found");
}

/**
 * Decodes the jwt token and returns a object with the name, email and _id of the user, if it exists
 *
 * @param {String} jwtToken A base64 encoded jwt token
 * @returns A promise which resolves to the authenticating user
 * @see https://github.com/auth0/node-jsonwebtoken/
 */
function authenticate(jwtToken) {
  if (typeof jwtToken != "string" || !jwtToken.trim()) {
    return;
  }

  if (jwtToken.startsWith("Bearer")) {
    jwtToken = jwtToken.slice(7);
  }

  return new Promise((resolve, reject) => {
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      const { userId } = decoded || {};

      if (err) {
        logger.error(err);
        reject(new ApolloError(err.message, err.name));
      } else {
        const repository = getRepository(User);
        const user = await repository.findOne(userId);

        if (user) {
          resolve(user);
        } else {
          reject(new AuthenticationError("Invalid credentials"));
        }
      }
    });
  });
}

module.exports = { authenticate };
