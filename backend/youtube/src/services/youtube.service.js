const https = require('https');
const { URL } = require('url');
const { logger } = require('../config');
const { ApolloError } = require('apollo-server');
const YoutubeSubtitleDAO = require('../dao/youtubeSubtitle.dao');

/**
 * Checks if the subtitles for this video is already stored in our database, 
 * from a previous request to youtube servers
 * 
 * @param {String} videoId The youtube video ID 
 */
async function getCachedSubtitles(videoId) {
    const { subtitles, dateCreated } = await YoutubeSubtitleDAO.findOne({ videoId }, "subtitles dateCreated", { lean: true }) || {};
    const _10_DAYS_MILLISECONDS = 8.64e+8;
    if (subtitles) {
        const diff = Date.now() - dateCreated.getTime();
        return (diff > _10_DAYS_MILLISECONDS) ? null : subtitles;
    }
}


/**
 * Caches the subtitles for some youtube video, avoiding a new request in the feature.
 * It's a best effort call, we'll not wait for MongoDB persist this on it's internal journal
 * and if some entry exists for this videoID, just update the fields 'subtitles' and 'dateCreated'
 * 
 * @param {String} videoId The youtube video id
 * @param {Array<{language: String, isAutomatic: Boolean, downloadUrl: String }>} subtitles The subtitles available for this video
 */
async function cacheSubtitles(videoId, subtitles) {
    const writeConcern = { j: false, wtimeout: 2000 };
    const object = { videoId, subtitles, dateCreated: new Date() };
    await YoutubeSubtitleDAO.replaceOne({ videoId }, object, { upsert: true, writeConcern })
}

/**
 * Sends a request to youtube servers to get the available subtitles for some video
 * 
 * @param {String} videoID Youtube video URL
 */
async function searchSubtitles(videoID) {
    return new Promise((resolve, reject) => {
        const options = { headers: { 'Accept-Language': 'en, en-uk' } };
        https.get(`https://www.youtube.com/get_video_info?video_id=${videoID}`, options, (res) => {
            const { statusCode } = res;

            if (statusCode == 200) {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const decodedData = decodeURIComponent(rawData);
                        if (!decodedData.includes('captionTracks')) {
                            throw new ApolloError("No subtitle available in this video", 'YOUTUBE_SERVICE', { videoID });
                        }

                        const regex = /({"captionTracks":.*isTranslatable":(true|false)}])/;
                        const [match] = regex.exec(decodedData);
                        const { captionTracks } = JSON.parse(`${match}}`);

                        const result = captionTracks.map(caption => ({
                            language: { code: caption.languageCode, name: caption.name.simpleText },
                            isAutomatic: caption.kind == 'asr',
                            downloadUrl: caption.baseUrl
                        }));

                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                });

            } else {
                reject(new ApolloError(`Request Failed. Status Code: ${statusCode}`, 'YOUTUBE_SERVICE', { videoID, statusCode }));
            }

        }).on('error', (e) => {
            reject(e);
        });
    })
}

async function getAvailableVideoSubtitles(youtubeUrl) {
    const url = new URL(youtubeUrl);
    if (!url.searchParams.has('v')) {
        throw new Error('Invalid youtube url');
    }
    const videoID = url.searchParams.get('v');

    try {
        let subtitles = await getCachedSubtitles(videoID);
        if (subtitles) {
            logger.debug(`Subtitles for ${videoID} loaded from cache`);
        } else {
            logger.debug(`Subtitles for ${videoID} not found locally ... calling youtube servers`)
            subtitles = await searchSubtitles(videoID);
            logger.debug('Caching subtitles ...')
            cacheSubtitles(videoID, subtitles);
        }

        return subtitles;
    } catch (error) {
        logger.error(`Error while retriving ${videoID} subtitles`, error);
        throw error;
    }
}

module.exports = {
    getAvailableVideoSubtitles
}