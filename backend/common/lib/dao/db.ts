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
    private sequelize?: Sequelize

    /**
     * connect
     */
    public connect(dbUrl: string) {
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
        this.sequelize = sequelize
    }

    /**
     * disconnect
     */
    public async disconnect() {
        if (this.sequelize)
            return this.sequelize?.close()
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


