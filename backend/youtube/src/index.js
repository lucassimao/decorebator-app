const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { logger, port } = require('./config');
const db = require('./db');

db.connect()
    .then(() => {
        const server = new ApolloServer({ typeDefs, resolvers, logger });
        server.listen({ port }).then(({ url }) => {
            logger.info(`🚀 Server ready at ${url}`);
        });
    })
    .catch(logger.error);

