import { Model, Sequelize } from 'sequelize';

export class User extends Model{
    public id?: number;
    public name?: String;
    public email?: String;
    public country?: String;
    public encryptedPassword?: String;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
}

export default (sequelize:Sequelize, DataTypes:any) => {
    User.init({
      name: { type: DataTypes.STRING, allowNull: false},
      encryptedPassword: { type: DataTypes.STRING, allowNull: false},
      country: { type: DataTypes.STRING, allowNull: false},
      email: { type: DataTypes.STRING, allowNull: false, validate: {isEmail: true}, unique: true}
    }, { sequelize });
    return User;
}