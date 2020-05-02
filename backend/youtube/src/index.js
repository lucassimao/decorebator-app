const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { logger, port, isDev } = require('./config');
const db = require('./db');
const AuthService = require('./services/auth.service');

db.connect()
    .then(() => {
        const server = new ApolloServer({
            typeDefs, resolvers, logger, context: contextFunction
        });
        server.listen({ port }).then(({ url }) => {
            logger.info(`🚀 Server ready at ${url}`);
        });
    })
    .catch(logger.error);

const contextFunction = ({ req }) => {
    const { operationName } = req.body || {};
    if (operationName == 'IntrospectionQuery' && isDev) {
        return
    }

    return AuthService.authenticate(req.headers.authorization);
}