const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const YoutubeSubtitle = new Schema({
    dateCreated: { type: Date, default: Date.now },
    videoId: { type: String, required: true, unique: true, index: true },
    subtitles: [
        { language: { code: { type: String, required: true }, name: { type: String, required: true } }, isAutomatic: Boolean, downloadUrl: { type: String, required: true } }
    ]
});


module.exports = mongoose.model('YoutubeSubtitle', YoutubeSubtitle)