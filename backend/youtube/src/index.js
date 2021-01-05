const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const AuthService = require("./services/auth.service");
const { default: logger } = require("./logger");
const { getConnection } = require("typeorm");
const { initDB } = require("./db");

if (!process.env.PORT) {
  throw new Error("env PORT not found");
}

let server = null;

const stopApp = async (info) => {
  if (typeof info !== 'string'){
    logger.error('Stoping app due error',info)
}
  const connection = getConnection();
  if (connection?.isConnected) {
    await connection.close();
  }
  if (server) {
    server.stop();
  }
  process.exit(info === 'SIGTERM' ? 0:-1)
};

async function init() {
  await initDB();

  server = new ApolloServer({
    typeDefs,
    resolvers,
    logger,
    context: contextFunction,
    cors: {
      origin: "*",
      allowedHeaders: "*",
      exposedHeaders: "*",
      credentials: true,
    },
  });
  server.listen({ port: process.env.PORT }).then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`);
  });
}

process.once("SIGUSR2", stopApp);
process.once("uncaughtException", stopApp);
process.once("unhandledRejection", stopApp);
process.once("SIGTERM", stopApp);    

init();

const contextFunction = ({ req }) => {
  const { operationName } = req.body || {};
  if (
    operationName == "IntrospectionQuery" &&
    process.env.NODE_ENV !== "production"
  ) {
    return;
  }

  return AuthService.authenticate(req.headers.authorization);
};
