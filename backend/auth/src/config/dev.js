module.exports = {
  httpDomain: `http://localhost:${process.env.HTTP_PORT}`,
  jwtExpiration: 60 * 60 * 24 * 365 // 1 year
};
