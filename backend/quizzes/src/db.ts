import { Connection, createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import logger from "./logger";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is required");
}

export async function initDB(): Promise<Connection> {
  const extension = process.env.NODE_ENV === "production" ? "*.js" : "*.ts";

  const promise = createConnection({
    url: process.env.DB_URL,
    logging: process.env.NODE_ENV !== "production",
    type: "postgres",
    entities: [`${__dirname}/entities/${extension}`],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    migrationsRun: true,
    maxQueryExecutionTime: 1000,
    migrations: [`${__dirname}/migrations/${extension}`],
  });
  promise.catch(logger.error);
  return promise;
}
