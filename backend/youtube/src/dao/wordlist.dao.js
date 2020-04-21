const mongoose = require("mongoose");
const { logger } = require("../config");

const Schema = mongoose.Schema;

const Wordlist = new Schema({
  owner: { type: Schema.Types.ObjectId, index: true, required: true },
  language: { type: String, required: true },
  words: [
    {
      name: { type: String, required: true },
      images: [{ url: { type: String, required: true }, description: String }],
      challenges: {
        total: { type: Number, default: 0 },
        wrongAnswers: { type: Number, default: 0 },
        lastUsed: Date
      }
    }
  ]
});

/**
 * @param {mongoose.Types.ObjectId} wordlistId The wordlist id
 * @param {object} user The authenticated user
 * @param {mongoose.Types.ObjectId} user._id The user id
 * 
 * @returns {Promise} A promise which resolves to a word object 
 */
Wordlist.static("leastUsedWordInChallenges", (wordlistId, user) => {
  const $match = { owner: user._id };
  if (wordlistId) {
    $match['_id'] = wordlistId;
  }

  return this.aggregate([
    { $match },
    { $unwind: "words" },
    { $sort: { total: -1, lastUsed: -1 } },
    { $limit: 1 }
  ], { lean: true });

})

module.exports = mongoose.model("Wordlist", Wordlist);
