const https = require("https");
const { URL } = require("url");

const { ApolloError } = require("apollo-server");
const { getRepository } = require("typeorm");
const { default: YoutubeSubtitle } = require("../entities/youtubeSubtitle");

const { default: logger } = require("../logger");

/**
 * Checks if the subtitles for this video is already stored in our database,
 * from a previous request to youtube servers
 *
 * @param {String} videoId The youtube video ID
 */
async function getCachedSubtitles(videoId) {
  const repository = getRepository(YoutubeSubtitle);
  const _10_DAYS_MILLISECONDS = 8.64e8;
  const youtubeSubtitles = await repository.find({ where: { videoId } });
  if (youtubeSubtitles) {
    const isAnyStale = youtubeSubtitles.find((ySubtitle) => {
      const dateCreated = new Date(ySubtitle.dateCreated);
      const diff = Date.now() - dateCreated.getTime();
      return diff > _10_DAYS_MILLISECONDS;
    });
    if (isAnyStale) {
      await repository.delete({ where: { videoId } });
    } else {
      return youtubeSubtitles;
    }
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
async function cacheSubtitles(subtitles) {
  const repository = getRepository(YoutubeSubtitle);

  const dtos = subtitles.map(
    ({ languageCode, languageName, videoId, isAutomatic, downloadUrl }) => ({
      isAutomatic,
      downloadUrl,
      videoId,
      languageCode,
      languageName,
    })
  );
  await repository.save(dtos);
}

/**
 * Sends a request to youtube servers to get the available subtitles for some video
 *
 * @param {String} videoId Youtube video URL
 */
async function searchSubtitles(videoId) {
  return new Promise((resolve, reject) => {
    const options = { headers: { "Accept-Language": "en, en-uk" } };
    https
      .get(
        `https://www.youtube.com/get_video_info?video_id=${videoId}&html5=1`,
        options,
        (res) => {
          const { statusCode } = res;

          if (statusCode == 200) {
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", (chunk) => {
              rawData += chunk;
            });
            res.on("end", () => {
              try {
                const decodedData = decodeURIComponent(rawData);
                if (!decodedData.includes("captionTracks")) {
                  throw new ApolloError(
                    "No subtitle available in this video",
                    "YOUTUBE_SERVICE",
                    { videoId }
                  );
                }

                const regex =
                  /({"captionTracks":.*isTranslatable":(true|false)}])/;
                const [match] = regex.exec(decodedData);
                const { captionTracks } = JSON.parse(`${match}}`);

                const result = captionTracks.map((caption) => ({
                  languageCode: caption.languageCode,
                  languageName: caption.name.simpleText,
                  isAutomatic: caption.kind == "asr",
                  downloadUrl: caption.baseUrl,
                  videoId,
                }));

                resolve(result);
              } catch (e) {
                reject(e);
              }
            });
          } else {
            reject(
              new ApolloError(
                `Request Failed. Status Code: ${statusCode}`,
                "YOUTUBE_SERVICE",
                { videoId, statusCode }
              )
            );
          }
        }
      )
      .on("error", (e) => {
        reject(e);
      });
  });
}

async function getAvailableVideoSubtitles(youtubeUrl) {
  const url = new URL(youtubeUrl);
  let videoID;

  if (url.host === "youtu.be") {
    videoID = url.pathname.slice(1);
  } else if (url.searchParams.has("v")) {
    videoID = url.searchParams.get("v");
  }

  if (!videoID) {
    throw new Error("Invalid youtube url");
  }

  try {
    let subtitles = await getCachedSubtitles(videoID);
    if (subtitles?.length > 0) {
      logger.debug(`Subtitles for ${videoID} loaded from cache`);
    } else {
      logger.debug(
        `Subtitles for ${videoID} not found locally ... calling youtube servers`
      );
      subtitles = await searchSubtitles(videoID);
      logger.debug("Caching subtitles ...");
      cacheSubtitles(subtitles);
    }

    return subtitles;
  } catch (error) {
    logger.error(`Error while retriving ${videoID} subtitles`, error);
    throw error;
  }
}

module.exports = {
  getAvailableVideoSubtitles,
};
