import { Model, Association, Sequelize, HasManyGetAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import { Image } from './image';

export class Word extends Model {
    public id?: number;
    public name?: String;

    public readonly createdAt!: Date;

    public getImages!: HasManyGetAssociationsMixin<Image>;
    public countImages!: HasManyCountAssociationsMixin;
    public createImage!: HasManyCreateAssociationMixin<Image>;


    public static associations: {
        images: Association<Word, Image>
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
        name: { type: DataTypes.STRING, allowNull: false }
    }, { sequelize, updatedAt: false });

    Word.hasMany(Image, { foreignKey: { name: 'word' } })
    return Word;
}
