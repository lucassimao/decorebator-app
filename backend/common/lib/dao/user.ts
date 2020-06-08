import { Model, Sequelize } from 'sequelize';
import { Wordlist } from './wordlist';
import { Word } from './word';

export class User extends Model {
    public id?: number;
    public name?: String;
    public email?: String;
    public country?: String;
    public encryptedPassword?: String;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async getAllWords(): Promise<String[]> {
        const words = await Word.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Word.name')), 'word_name']],
            order: [['name','ASC']],
            include: [
                {
                    model: Wordlist,
                    attributes: [],
                    where: { ownerId: this.id! }
                }
            ],
            group:['word_name'],
            raw:true
        })

        // @ts-ignore
        return words.map(({word_name}) => word_name )
    }

    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    User.init({
        name: { type: DataTypes.STRING, allowNull: false },
        encryptedPassword: { type: DataTypes.STRING, allowNull: false },
        country: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true }, unique: true }
    }, { sequelize });
    return User;
}