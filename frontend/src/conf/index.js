let environment = { api: {} };

switch (process.env.NODE_ENV) {
  case "production":
    break;
  case "development":
    environment.api.wordlists = "http://localhost:3001/wordlists";
    environment.api.auth = "http://localhost:3002/auth";
    break;
  default:
    throw new Error("Unknown environment: " + process.env.NODE_ENV);
}

export default environment;
