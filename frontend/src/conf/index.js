let environment = { api: {} };

switch (process.env.NODE_ENV) {
  case "production":
    break;
  case "development":
      environment.api.auth = "http://localhost:3001/auth";
    environment.api.wordlists = "http://localhost:3002/wordlists";
    break;
  default:
    throw new Error("Unknown environment: " + process.env.NODE_ENV);
}

export default environment;
