const https = require('https');
const { URL } = require('url');
const { logger } = require('../config');


async function getAvailableVideoSubtitles(youtubeUrl) {
    const url = new URL(youtubeUrl);
    if (!url.searchParams.has('v')) {
        throw new Error('Invalid youtube url');
    }
    const videoID = url.searchParams.get('v');

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
                            throw new Error(`Could not find captions for video: ${videoID}`);
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
                        logger.error(e);
                        reject(e);
                    }
                });

            } else {
                reject(new Error(`Request Failed. Status Code: ${statusCode}`));
            }

        }).on('error', (e) => {
            logger.error(e);
            reject(e);
        });
    })
}

module.exports = {
    getAvailableVideoSubtitles
}