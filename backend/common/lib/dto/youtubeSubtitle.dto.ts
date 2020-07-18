export default interface YoutubeSubtitleDTO {
    id?: number;
    videoId?: string;
    languageCode?: string;
    languageName?: string;
    isAutomatic?: boolean;
    downloadUrl?: string;
    createdAt?: string;
    updatedAt?:string
}