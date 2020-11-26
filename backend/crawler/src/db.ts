import { config } from '@lucassimao/decorabator-common';
import { Connection, createConnection } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

if (!process.env.DB_URL) {
    throw new Error('DB_URL is required')
}

export async function initDB(): Promise<Connection> {
    const extension = process.env.NODE_ENV === 'production' ? '*.js' : '*.ts';

    const promise = createConnection({
        url: process.env.DB_URL,
        type: 'postgres',
        entities: [
            `${__dirname}/entities/${extension}`
        ],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy()
    })
    promise.catch((error: any) => config.logger.error(error));
    return promise;
}

