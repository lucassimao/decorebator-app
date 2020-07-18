import fs from "fs";
import { Association, HasManyGetAssociationsMixin, Model, Sequelize } from 'sequelize';
import { Wordlist } from './wordlist';

export class User extends Model {
    public id?: number;
    public name?: string;
    public email?: string;
    public country?: string;
    public encryptedPassword?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getWordlists!: HasManyGetAssociationsMixin<Wordlist>;

    public static associations: {
        wordlist: Association<User, Wordlist>,
    }    

    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
}

type Country = {
    "alpha-2": string
}
var countryCodes = JSON.parse(
    fs.readFileSync(__dirname + "/../resources/countries.json", "utf8")
  ).map((country: Country) => country["alpha-2"]);

export default (sequelize: Sequelize, DataTypes: any) => {
    User.init({
        name: { type: DataTypes.STRING, allowNull: false },
        encryptedPassword: { type: DataTypes.STRING, allowNull: false },
        country: { type: DataTypes.ENUM, allowNull: false,values: countryCodes, validate: {isIn: [countryCodes]} },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true }, unique: true }
    }, { sequelize });
    return User;
}