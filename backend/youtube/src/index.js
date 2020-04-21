const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const {logger, port} = require('./config')


const server = new ApolloServer({ typeDefs, resolvers, logger });

server.listen({port}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});