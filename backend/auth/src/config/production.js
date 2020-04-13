if (!process.env.JWT_SECRET_KEY)
  throw "Jwt secret key must be provided as an environment variable in production";

module.exports = {
  httpDomain: `https://decorebator.com`,
  jwtExpiration: 3600 // 1 hour
};
