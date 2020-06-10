import { Sequelize, Model, ModelCtor } from "sequelize";

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

    private constructor(private sequelize: Sequelize){}

    
    public static get instance() : Database {
        return this._instance
    }
    

    /**
     * Used to construct a singleton instance of the Database class
     */
    public static connect(dbUrl: string) : Database {
        const sequelize = new Sequelize(dbUrl, {
            pool, dialectOptions: {
                options: {
                    connectTimeout: 3000,
                    requestTimeout: 3000
                }
            },
        })
        sequelize.import(__dirname + "/image")
        sequelize.import(__dirname + "/binaryExtraction")
        sequelize.import(__dirname + "/user")
        sequelize.import(__dirname + "/word")
        sequelize.import(__dirname + "/wordlist")
        sequelize.import(__dirname + "/youtubeSubtitle")
        Database._instance = new Database(sequelize)
        return Database._instance
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
    public doInsideTransaction(operation: () => Promise<void> )  {
        return this.sequelize.transaction(operation)
    }

    
    public get models() : {
        [key: string]: ModelCtor<Model>;
      }  {
        return this.sequelize?.models ?? {}
    }
    

    /**
     * createDatabase
     */
    public async createDatabase() {
        if (!this.sequelize){
            return false
        }
        await this.sequelize.sync()
        return true;
    }
}


