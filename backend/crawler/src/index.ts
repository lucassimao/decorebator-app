import { config } from '@lucassimao/decorabator-common';
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "reflect-metadata";
import { router } from "./webhooks";
import { initDB } from "./db";
import { Server } from 'http';
import { getConnection } from "typeorm";
import logger from "./logger";

const { port } = config;

let server: Server;
const app = express();
app.set("trust proxy", 1);
app.use(config.isDev ? morgan("dev", { immediate: true }) : morgan("combined"));
app.use(helmet());
app.use(express.json());
app.use(router);

const stopApp = async (info: any) => {
    logger.error('stoping server due ...', info)
    
    const connection = getConnection()
    if (connection?.isConnected) {
        await connection.close()
    }    
    if (server) {
        server.close()
    }
    process.exit(-1)
}

async function init() {
    await initDB()
    server = app.listen(port);
    logger.info(`crawler is listenning at ${port}`);

    process.once("SIGUSR2", stopApp);
    process.once("uncaughtException", stopApp);
    process.once("unhandledRejection", stopApp);
}    

init()