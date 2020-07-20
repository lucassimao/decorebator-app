import { Sequelize, Model, ModelCtor, Transaction, SyncOptions } from "sequelize";

const pool = {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 10000,
    evict: 60000,
    handleDisconnects: true
}

export default class Database {
    private static _instance: Database

    private constructor(private sequelize: Sequelize) { }


    public static get instance(): Database {
        return this._instance
    }

    /**
     * Used to construct a singleton instance of the Database class
     */
    public static async connect(uri?: string): Promise<Database> {
        if (typeof uri === 'string') {
            const sequelize = new Sequelize(uri)
            return this.configure(sequelize)
        } else {
            const socketPath = process.env.SOCKET_PATH;
            if (!socketPath){
                throw new Error('SOCKET_PATH env is required')
            }

            const dbName = process.env.POSTGRES_DB;
            if (!dbName){
                throw new Error('POSTGRES_DB env is required')
            }
            const password = process.env.POSTGRES_PASSWORD;
            if (!password){
                throw new Error('POSTGRES_PASSWORD env is required')
            }            
            const user = process.env.POSTGRES_USER;
            if (!user){
                throw new Error('POSTGRES_USER env is required')
            }

            const sequelize = new Sequelize(dbName, user, password, {
                dialect: 'postgres',
                host: socketPath,
                pool, dialectOptions: {
                    options: {
                        connectTimeout: 3000,
                        requestTimeout: 3000,
                    }
                },
            })
            return this.configure(sequelize)
        }
    }

    private static async configure(sequelize: Sequelize): Promise<Database> {
        sequelize.import(__dirname + "/entities/image")
        sequelize.import(__dirname + "/entities/binaryExtraction")
        sequelize.import(__dirname + "/entities/user")
        sequelize.import(__dirname + "/entities/word")
        sequelize.import(__dirname + "/entities/wordlist")
        sequelize.import(__dirname + "/entities/youtubeSubtitle")
        Database._instance = new Database(sequelize)


        return Database._instance
    }

    /**
     * async sync
     */
    public async sync(syncOptions?: SyncOptions) {
        if (!this.sequelize){
            return;
        }

        if (process.env.NODE_ENV === 'test') {
            await this.sequelize.sync(syncOptions)
        } else {
            throw new Error("Operation only supported in test environmen");
        }
    }

    /**
     * disconnect
     */
    public async disconnect() {
        if (this.sequelize)
            return this.sequelize?.close()
    }

    /**
     * transact
     */
    public doInsideTransaction<T>(operation: (t: Transaction) => Promise<T>) {
        return this.sequelize.transaction(operation)
    }


    public get models(): {
        [key: string]: ModelCtor<Model>;
    } {
        return this.sequelize?.models ?? {}
    }

}


