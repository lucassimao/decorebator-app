import YoutubeSubtitleDTO from "../dto/youtubeSubtitle.dto"
import { YoutubeSubtitle } from "../entities/youtubeSubtitle"

export default {

    async getAllByVideoId(videoId: string): Promise<YoutubeSubtitleDTO[] | null> {
        const subtitles = await YoutubeSubtitle.findAll({ where: { videoId } })
        return subtitles?.map(sub => sub.get({ plain: true }) as YoutubeSubtitleDTO)
    },

    async deleteVideoSubtitles(videoId: string) {
        return YoutubeSubtitle.destroy({ where: { videoId } })
    },

    async bulkInsert(dtos: YoutubeSubtitleDTO[]) {
        const newSubtitles = await YoutubeSubtitle.bulkCreate(dtos.map(({ downloadUrl, isAutomatic, languageCode, languageName, videoId }) => ({ downloadUrl, isAutomatic, languageCode, languageName, videoId })))
        return newSubtitles.map(ySub => ySub.get({ plain: true }))
    }
}