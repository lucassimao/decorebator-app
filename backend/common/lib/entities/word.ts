import { Association, BelongsToGetAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, Model, Sequelize, HasManyRemoveAssociationMixin } from 'sequelize';
import { Image } from './image';
import { Wordlist } from './wordlist';

export class Word extends Model {
    public id?: number;
    public name?: String;

    public readonly createdAt!: Date;

    public getImages!: HasManyGetAssociationsMixin<Image>;
    public countImages!: HasManyCountAssociationsMixin;
    public createImage!: HasManyCreateAssociationMixin<Image>;
    public deleteImage!: HasManyRemoveAssociationMixin<Image,number>;


    public getWordlist!: BelongsToGetAssociationMixin<Wordlist>

    public static associations: {
        images: Association<Word, Image>,
        wordlist: Association<Word, Wordlist>,
    }
    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
}



export default (sequelize: Sequelize, DataTypes: any) => {
    Word.init({
        name: { type: DataTypes.STRING, allowNull: false },
    }, { sequelize, updatedAt: false, name: { singular: 'word', plural: 'words' } });

    Word.hasMany(Image, { foreignKey: { name: 'wordId' } });

    return Word;
}
