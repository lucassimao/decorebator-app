import { Model, Sequelize } from 'sequelize';

export class BinaryExtraction extends Model {
    public id?: number;
    public extension?: String;
    public size?: Number;
    public extractionMs?: Number;
}

export default (sequelize: Sequelize, DataTypes: any) => {
    BinaryExtraction.init({
        extension: { type: DataTypes.STRING, allowNull: false },
        size: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
        extractionMs: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } }
    }, { sequelize, createdAt: false, updatedAt: false });
    return BinaryExtraction;
}