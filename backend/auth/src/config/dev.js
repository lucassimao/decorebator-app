const DEV_SERVER_PORT = 3000;

module.exports = {
  httpDomain: `http://localhost:${DEV_SERVER_PORT}`,
  jwtExpiration: 60 * 60 * 24 * 365 // 1 year
};
