import { Association, Model, Sequelize, HasManyCreateAssociationMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasOneGetAssociationMixin, HasOneCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize';
import { User } from "./user";
import { Word } from './word';
import { BinaryExtraction } from './binaryExtraction';

export class Wordlist extends Model {
    public id?: number;
    public isPrivate?: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public description?: String;
    public language?: String;
    public name?: String;
    public avatarColor?: String;

    public getWords!: HasManyGetAssociationsMixin<Word>;
    public countWords!: HasManyCountAssociationsMixin;
    public createWord!: HasManyCreateAssociationMixin<Word>;

    public getBinaryExtraction!: HasOneGetAssociationMixin<BinaryExtraction>;
    public createBinaryExtraction!: HasOneCreateAssociationMixin<BinaryExtraction>;

    public getOwner!: BelongsToGetAssociationMixin<User>
    public setOwner!: BelongsToSetAssociationMixin<User, number>


    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
    public static associations: {
        owner: Association<Wordlist, User>,
        words: Association<Wordlist, Word>,
        binaryExtraction: Association<Wordlist, BinaryExtraction>
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    Wordlist.init({
        name: { type: DataTypes.STRING, allowNull: false },
        isPrivate: { type: DataTypes.BOOLEAN, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        language: { type: DataTypes.STRING, allowNull: false },
        avatarColor: { type: DataTypes.STRING, allowNull: false },
    }, { sequelize, updatedAt: false });

    Wordlist.hasMany(Word, { foreignKey: 'wordlistId'  })
    Word.belongsTo(Wordlist,{foreignKey: 'wordlistId'})
    Wordlist.belongsTo(User, { foreignKey: { allowNull: false, name: 'ownerId' } })
    Wordlist.hasOne(BinaryExtraction, { foreignKey: { name: 'wordlistId' } })
    return Wordlist;
}