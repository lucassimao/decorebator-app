
const youtubeService = require('../services/youtube.service');
const {logger} = require('../config');

const resolvers = {
    Query: {
        getAvailableVideoSubtitles(_, args, context, info) {
            return youtubeService.getAvailableVideoSubtitles(args.url);
        }
    }
}

module.exports = resolvers;