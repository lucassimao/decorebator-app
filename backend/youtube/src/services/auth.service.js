const jwt = require("jsonwebtoken");
const { AuthenticationError, ApolloError } = require("apollo-server");
const {
  config: { logger, jwtSecretKey },
  UserRepository,
} = require("@lucassimao/decorabator-common");

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
    jwt.verify(jwtToken, jwtSecretKey, async (err, decoded) => {
      const { userId } = decoded || {};

      if (err) {
        logger.error(err);
        reject(new ApolloError(err.message, err.name));
      } else {
        const user = await UserRepository.getById(userId);

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
