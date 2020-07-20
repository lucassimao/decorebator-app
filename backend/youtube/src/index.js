const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const AuthService = require("./services/auth.service");
const { Database, config: { logger, port, isDev,isProduction,dbUrl } } = require('@lucassimao/decorabator-common')

Database.connect(dbUrl)
  .then(() => {
    const origin = isProduction ? ['decorebator.com','decorebator.web.app'] : '*'

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      logger,
      context: contextFunction,
      cors:{origin,allowedHeaders:'*',exposedHeaders:'*',credentials:true}
    });
    server.listen({ port }).then(({ url }) => {
      logger.info(`🚀 Server ready at ${url}`);
    });

    process.once("SIGUSR2", async () => {
      await Database.instance.disconnect()
      if (server) {
        await server.stop()
      }
    });

  })
  .catch(logger.error);




const contextFunction = ({ req }) => {
  const { operationName } = req.body || {};
  if (operationName == "IntrospectionQuery" && isDev) {
    return;
  }

  return AuthService.authenticate(req.headers.authorization);
};
