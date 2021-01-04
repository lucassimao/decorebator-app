import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { ApolloServer, ServerInfo } from "apollo-server";
import AuthService from "./services/auth.service";
import http from "http";
import path from "path";
import { getConnection } from "typeorm";
import { initDB } from "./db";
import logger from "./logger";
import resolvers from "./resolvers";

if (!process.env.PORT) {
  throw new Error("env variable PORT not found");
}

let server: http.Server;

const stopApp = async (error: string | Error | any) => {
  logger.error("stopping server ...", error);

  const connection = getConnection();
  if (connection?.isConnected) {
    await connection.close();
  }
  if (server) {
    server.close();
  }
  process.exit(-1);
};

initDB()
  .then(() => {
    const schema = loadSchemaSync(path.join(__dirname, "typeDefs.graphql"), {
      resolvers,
      loaders: [new GraphQLFileLoader()],
    });
    const server = new ApolloServer({
      schema,
      cors: {
        origin: "*",
        allowedHeaders: "*",
        exposedHeaders: "*",
        credentials: true,
      },
      context: async (expressContext) => {
        const req = expressContext.req;
        const { operationName } = req.body || {};
        if (
          operationName == "IntrospectionQuery" &&
          process.env.NODE_ENV !== "production"
        ) {
          return;
        }

        const user = await AuthService.authenticate(
          req.headers.authorization ?? ""
        );
        return { user };
      },
    });
    return server.listen(process.env.PORT);
  })
  .then((serverInfo: ServerInfo) => {
    server = serverInfo.server;
    console.log(`🚀  Server ready at ${serverInfo.url}`);
  });

process.once("SIGUSR2", stopApp);
process.once("uncaughtException", stopApp);
process.once("unhandledRejection", stopApp);
