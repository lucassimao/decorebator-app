const {
  default: UrlMetadataService,
} = require("../services/urlMetadataService");
const youtubeService = require("../services/youtube.service");

const resolvers = {
  Query: {
    getAvailableVideoSubtitles(_, args) {
      return youtubeService.getAvailableVideoSubtitles(args.url);
    },
    getUrlMetaData(_, args) {
      return UrlMetadataService.getUrlMetadata(args.url);
    },
  },
};

module.exports = resolvers;
