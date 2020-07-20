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

    private constructor(private sequelize: Sequelize){}

    
    public static get instance() : Database {
        return this._instance
    }
    

    /**
     * Used to construct a singleton instance of the Database class
     */
    public static async  connect(dbUrl: string) : Promise<Database> {

        const sequelize = new Sequelize(dbUrl, {
            pool, dialectOptions: {
                options: {
                    connectTimeout: 3000,
                    requestTimeout: 3000,
                }
            },
        })
        sequelize.import(__dirname + "/entities/image")
        sequelize.import(__dirname + "/entities/binaryExtraction")
        sequelize.import(__dirname + "/entities/user")
        sequelize.import(__dirname + "/entities/word")
        sequelize.import(__dirname + "/entities/wordlist")
        sequelize.import(__dirname + "/entities/youtubeSubtitle")
        Database._instance = new Database(sequelize)

        if (process.env.NODE_ENV === 'test'){
            let syncOptions : SyncOptions  = {force:true}
            await sequelize.sync(syncOptions)
        }
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
    public doInsideTransaction<T>(operation: (t: Transaction) => Promise<T> )  {
        return this.sequelize.transaction(operation)
    }

    
    public get models() : {
        [key: string]: ModelCtor<Model>;
      }  {
        return this.sequelize?.models ?? {}
    }

}


