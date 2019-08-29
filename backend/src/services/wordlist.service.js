const WordlistDao = require('../dao/wordlist.dao');
const config = require('../config');
const mongoose = require('mongoose')


const list = (user, { pageSize = config.defaultPageSize, page = 0 }) => {
    const skip = (page > 0) ? (page - 1) * pageSize : 0
    return WordlistDao.find({ user }, null, { limit: pageSize, skip }).exec();
}

const save = (wordlist) => {
    return WordlistDao.create(wordlist)
}

const get = (id) => {
    return WordlistDao.findOne({ _id: mongoose.Types.ObjectId(id) })
}

const update = (id, updateObj) => {
    return WordlistDao.findByIdAndUpdate(id, updateObj).exec()
}

module.exports = {
    list, save, get, update
};