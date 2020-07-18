const textract = require('textract')
const { performance } = require('perf_hooks');

const { WordlistQueryBuilder, WordlistRepository,config, UserRepository } = require("@lucassimao/decorabator-common")



/**
 * Returns user's wordlists
 *
 * @param {number} pageSize The amount of wordlists to be returned
 * @param {number} page As the data set is seen as a set of pages, this param represents the requested page
 * @param {String} filter A search key to use as filter to the field name of the wordlists
 * @param {User} user The authenticated user
 *
 * @returns {Promise} A promise, which resolves to an array of wordlists
 */
const list = ({ pageSize = config.defaultPageSize, page = 0, filter }, user) => {
  const queryBuilder = new WordlistQueryBuilder()
  queryBuilder.owner(user).paginate(pageSize, page).orderedByIdDesc()

  if (filter) {
    queryBuilder.nameIlike(filter)
  }
  return WordlistRepository.filter(queryBuilder)
};

/**
 * Returns public wordlists
 *
 * @param {number} pageSize The amount of wordlists to be returned
 * @param {number} page As the data set is seen as a set of pages, this param represents the requested page
 * @param {String} filter A search key to use as filter to the field name of the wordlists
 * @param {User} user The authenticated user
 *
 * @returns {Promise} A promise, which resolves to an array of wordlists
 */
const listPublic = ({ pageSize = config.defaultPageSize, page = 0, filter }, user) => {
  const queryBuilder = new WordlistQueryBuilder()
  queryBuilder.notOwnedBy(user).private(false)
    .paginate(pageSize, page).orderedByIdDesc()

  if (filter) {
    queryBuilder.nameIlike(filter)
  }
  return WordlistRepository.filter(queryBuilder)
};


/**
 * Register a new wordlist
 *
 * @param {object} wordlist the wordlist to be persisted
 * @param {User} user The authenticated user, owner of the new wordlist
 *
 * @returns {Promise} A promise, which resolves to the persisted object
 */
const save = async (wordlist, user) => {
  const logger = config.logger;
  const { minWordLength = 1, onlyNewWords = false } = wordlist
  let fileInfo
  let words = []

  if (wordlist.base64EncodedFile) {
    const { fileType, buffer } = __parseBase64EncodedFile(wordlist.base64EncodedFile)
    var t0 = performance.now()
    words = await __extractWordsFromBuffer(buffer)
    var t1 = performance.now()

    fileInfo = { extractionMs: t1 - t0, extension: fileType, size: buffer.length }
  } else if (Array.isArray(wordlist.words)) {
    words = wordlist.words.map(({ name }) => name)
  }
  const isArrayOfWordsValid = words && Array.isArray(words) && words.length > 0;

  if (isArrayOfWordsValid) {
    const uniqueWords = new Set(words.map(__formatWord))
    words = [...uniqueWords]
      .filter(name => name.length >= minWordLength)
      .sort()
      .map(name => ({ name }))

    if (onlyNewWords) {
      logger.debug(`Registering new wordlist for user ${user.id} with ${words.length} words`);

      const existingNames = await UserRepository.getAllWords(user.id);
      logger.debug(`User ${user.id} has ${existingNames.length} words already`);

      words = words.filter(
        ({ name }) => !__binarySearch(existingNames, name, 0, existingNames.length)
      );
      logger.debug(`Filtered wordlist for user ${user.id} now with ${words.length} words`);
    }
  }

  return WordlistRepository.save(wordlist, user.id, words, fileInfo)
};

/**
 * Search the database for a wordlist with an id, returning all fields but words
 *
 * @param {number} id the wordlist id
 * @param {User} user The authenticated user, owner of the wordlist
 *
 * @returns {Promise} A promise, which resolves to the persisted object, if found
 */
const get = async (id, user) => {
  const queryBuilder = new WordlistQueryBuilder()
  queryBuilder.id(id).includeWordsCount()
  if (user){
    queryBuilder.ownerId(user.id)
  }

  const result = await WordlistRepository.filter(queryBuilder)
  if (result?.length === 1) {
    return result[0]
  }
};

/**
 * Search the database for a wordlist with an _id, returning all fields
 *
 * @param {number} id the wordlist id
 * @param {User} user The authenticated user, owner of the wordlist
 * @param {number} user.id The user id
 *
 * @returns {Promise} A promise, which resolves to the persisted object, if found
 */
const getWithWords = async (id, user) => {
  const queryBuilder = new WordlistQueryBuilder()
  queryBuilder.ownerId(user.id).id(id).includeWords()

  const result = await WordlistRepository.filter(queryBuilder)
  if (result?.length === 1) {
    return result[0]
  }
};

/**
 * Updates a existing wordlist
 *
 * @param {number} id The id of the object to be updated
 * @param {User} user The authenticated user, owner of the wordlist
 * @param {number} user.id The user id
 *
 * @returns {Promise} A promise, which resolves to an operation info object from MongoDB
 */
const update = async (id, updateObj, user) => {
  return WordlistRepository.update(updateObj, id, user.id)
};

/**
 * removes an existing wordlist
 *
 * @param {number} id The id of the wordlist to be removed
 * @param {User} user The authenticated user, owner of the wordlist
 * @param {number} user.id The user id
 *
 * @returns {Promise} A promise, which resolves to an operation info object from MongoDB
 */
const remove = async (id, user) => {
  return WordlistRepository.delete(id, user.id)
};



/**
 * Checks if a string contains a valid binary file
 * 
 * @param {String} base64EncodedFile A base 64 encoded binary file
 * @returns {{fileType: String, buffer: Buffer}} a object identifying the file type and the buffer
 */
const __parseBase64EncodedFile = (base64EncodedFile) => {
  const logger = config.logger;
  const regex = /data:(\S+);base64,(\S+)/
  const isString = typeof base64EncodedFile == 'string'

  if (!isString || !regex.test(base64EncodedFile)) {
    logger.debug('Invalid base64 encoded file was sent')
    logger.debug(base64EncodedFile)
    throw new Error('Invalid file')
  }

  [, fileType, data] = regex.exec(base64EncodedFile)
  const buffer = Buffer.from(data, 'base64')
  return { fileType, buffer }
}
/**
 * Extract words from a buffer
 * 
 * @param {Buffer} buffer A buffer object representing a binary file
 * @returns {Pomise<Array<String>>} a promise which resolves to a set of words found in the buffer passed as argument
 */
const __extractWordsFromBuffer = async (buffer) => {
  return new Promise((resolve, reject) => {

    //TODO<backend> buffer size should be bigger for paying users
    const options = { preserveLineBreaks: false, exec: { maxBuffer: 2 * 1024 * 1024 } }
    textract.fromBufferWithMime(fileType, buffer, options, function (error, text) {
      if (error) {
        const logger = config.logger;
        logger.error(`Error while extracting text from a ${fileType}`, error)
        reject(error)
      } else {
        const allWords = text.toLowerCase().split(/\s+/).map(word => word.trim()).filter(string => string.length > 0)
        resolve(allWords)
      }
    })

  })
}

/**
 * Makes a binary search of element inside the array.
 *
 * Assumptions: - The array is already sorted
 *              - There's no undefined element on the array
 *
 * @param {Array<any>} array The array of elements
 * @param {any} element The element to be searched in the array
 * @returns {Boolean} indicating whether the element is in the array or not
 */
function __binarySearch(array, element, start, end, debug = false) {
  const middle = start + Math.floor((end - start) / 2);
  debug &&
    config.logger.debug(`start: ${start}, middle : ${middle}, end: ${end}`);

  if (start >= end) {
    return false;
  } else if (array[middle] < element) {
    return __binarySearch(array, element, middle + 1, end, debug);
  } else if (array[middle] > element) {
    return __binarySearch(array, element, start, middle, debug);
  } else {
    return array[middle] === element;
  }
}

/**
 * Remove non alpha numeric characteres and lower cases the word
 * 
 * @param {String} word The word to be formatted
 */
const __formatWord = (word) => {
  if (!word) return '';

  return word
    .replace(/<\S+[^>]*>/ig, "")
    .replace(/<\/\S+>/ig, "")
    .replace(/[[\]#\$(),;{}:."?!_=&]/g, "")
    .replace(/^'/, "")
    .replace(/'$/, "")
    .replace(/^\d+$/g, "") // just numbers? fuck
    .toLowerCase().trim();

}

const api = {
  list,
  listPublic,
  save,
  get,
  getWithWords,
  update,
  delete: remove
};

module.exports = api;
