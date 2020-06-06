import { Model, Sequelize } from 'sequelize';

export class YoutubeSubtitle extends Model {
    public id?: number;
    public videoId?: String;
    public languageCode?: String;
    public languageName?: String;
    public isAutomatic?: Boolean;
    public downloadUrl?: String;

    public readonly createdAt!: Date;
    /**
     * @deprecated use createdAt
     */
    public get dateCreated(): Date {
        return this.createdAt
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    YoutubeSubtitle.init({
        videoId: { type: DataTypes.STRING, allowNull: false, unique: true },
        languageCode: { type: DataTypes.STRING, allowNull: false},
        languageName: { type: DataTypes.STRING, allowNull: false},
        isAutomatic: { type: DataTypes.BOOLEAN, allowNull: false},
        downloadUrl: { type: DataTypes.STRING, allowNull: false, validate: {isUrl: true}},
    }, { sequelize, updatedAt: false });

    return YoutubeSubtitle;
}