import { Model, Sequelize } from 'sequelize';

export class YoutubeSubtitle extends Model {
    public id?: number;
    public videoId?: String;
    public languageCode?: String;
    public languageName?: String;
    public isAutomatic?: Boolean;
    public downloadUrl?: String;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    YoutubeSubtitle.init({
        videoId: { type: DataTypes.STRING, allowNull: false },
        languageCode: { type: DataTypes.STRING, allowNull: false },
        languageName: { type: DataTypes.STRING, allowNull: false },
        isAutomatic: { type: DataTypes.BOOLEAN, allowNull: false },
        downloadUrl: { type: DataTypes.TEXT, allowNull: false, validate: { isUrl: true } },
    }, { sequelize, indexes: [{ fields: ['videoId'], unique: false }] });

    return YoutubeSubtitle;
}