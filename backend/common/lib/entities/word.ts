import { Association, BelongsToGetAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, Model, Sequelize } from 'sequelize';
import { Image } from './image';
import { Wordlist } from './wordlist';

export class Word extends Model {
    public id?: number;
    public name?: String;

    public getImages!: HasManyGetAssociationsMixin<Image>;
    public countImages!: HasManyCountAssociationsMixin;
    public createImage!: HasManyCreateAssociationMixin<Image>;

    public getWordlist!: BelongsToGetAssociationMixin<Wordlist>

    public static associations: {
        images: Association<Word, Image>,
        wordlist: Association<Word, Wordlist>,
    }
}



export default (sequelize: Sequelize, DataTypes: any) => {
    Word.init({
        name: { type: DataTypes.STRING, allowNull: false },
    }, { sequelize, createdAt:false, updatedAt: false, name: { singular: 'word', plural: 'words' } });

    Word.hasMany(Image, { foreignKey: { name: 'wordId' } });

    return Word;
}
