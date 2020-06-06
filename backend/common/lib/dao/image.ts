import { Model, Sequelize } from 'sequelize';

export class Image extends Model {
  public id?: number;
  public url?: String;
  public description?: String;

  public readonly createdAt!: Date;

}

export default (sequelize: Sequelize, DataTypes: any) => {
  Image.init({
    url: { type: DataTypes.STRING, allowNull: false, validate: { isUrl: true } },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, { sequelize, updatedAt: false });
  return Image;
}