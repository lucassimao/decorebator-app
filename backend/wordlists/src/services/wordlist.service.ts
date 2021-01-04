import { performance } from "perf_hooks";
import textract from "textract";
import { DeepPartial, FindConditions, getConnection, getRepository, ILike } from "typeorm";
import User from "../entities/user";
import Word from "../entities/word";
import Wordlist from "../entities/wordlist";
import logger from "../logger";
import wordService from "./word.service";
import { PubSub } from '@google-cloud/pubsub';

type WordlistDTO = Partial<Wordlist> & {
  minWordLength: number;
  onlyNewWords: boolean;
  base64EncodedFile: string;
};

type ListDTO = {
  pageSize?: number;
  page?: number;
  filter: string;
};
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 0;

const topic: string = process.env.PUB_SUB_WORDS_TOPIC ?? ''
if (!topic) {
  throw new Error('PUB_SUB_WORDS_TOPIC is required')
}

const pubSubClient = new PubSub();


function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}


const list = (
  { pageSize = DEFAULT_PAGE_SIZE, page = DEFAULT_PAGE, filter }: ListDTO,
  user: User
) => {
  const repository = getRepository(Wordlist);
  const where: FindConditions<Wordlist> = { ownerId: user.id };
  if (filter) {
    where.name = ILike(`%${filter}%`);
  }
  return repository.find({
    where,
    order: { id: "DESC" },
    take: pageSize,
    skip: page
  });
};

/**
 * Register a new wordlist
 *
 * @param {object} wordlistDTO the wordlist to be persisted
 * @param {User} user The authenticated user, owner of the new wordlist
 *
 * @returns {Promise} A promise, which resolves to the persisted object
 */
const save = async (wordlistDTO: WordlistDTO, user: User) => {
  const repository = getRepository(Wordlist);

  const {
    minWordLength = 1,
    onlyNewWords = false,
    base64EncodedFile,
    ...wordlist
  } = wordlistDTO;
  let fileInfo;
  let words: Array<string> = [];

  if (base64EncodedFile) {
    const { fileType, buffer } = __parseBase64EncodedFile(
      wordlistDTO.base64EncodedFile
    );
    var t0 = performance.now();
    words = await __extractWordsFromBuffer(buffer, fileType);
    var t1 = performance.now();

    fileInfo = {
      extractionMs: t1 - t0,
      extension: fileType,
      size: buffer.length
    };
  } else if (Array.isArray(wordlistDTO.words)) {
    words = wordlistDTO.words?.map(({ name }) => name).filter(notEmpty);
  }
  const isArrayOfWordsPresent =
    words && Array.isArray(words) && words.length > 0;

  if (isArrayOfWordsPresent) {
    const uniqueWords = new Set(words.map(__formatWord));
    words = [...uniqueWords].filter(name => name.length >= minWordLength);

    if (onlyNewWords) {
      logger.debug(
        `Registering new wordlist for user ${user.id} with ${words.length} words`
      );

      const existingNames = await wordService.getAllWordsByUser(user.id!);
      logger.debug(`User ${user.id} has ${existingNames.length} words already`);

      words = words.filter(name => !existingNames.includes(name));
      logger.debug(
        `Filtered wordlist for user ${user.id} now with ${words.length} words`
      );
    }
  }

  let entity: DeepPartial<Wordlist> = {
    ...wordlist,
    ownerId: user.id,
    words: words.map(name => ({ name }))
  };
  if (fileInfo) {
    entity = {
      ...entity,
      originalFileExtension: fileInfo?.extension,
      originalFileExtractionMs: fileInfo?.extractionMs,
      originalFileSize: fileInfo?.size
    };
  }
  const record = await repository.save(entity);

  if (isArrayOfWordsPresent) {

    try {
      const batchPublisher = pubSubClient.topic(topic, {
        batching: {
          maxMessages: 100,
          maxMilliseconds: 10 * 1000,
        },
      });
      const languageCode = wordlist.language;

      logger.debug(`Publishing payload to Pub/Sub ...`)
      for (const word of (record.words ?? [])) {
        const payload = { id: word.id, languageCode, name: word.name }
        const dataBuffer = Buffer.from(JSON.stringify(payload));
        batchPublisher.publish(dataBuffer);
      }

    } catch (error) {
      logger.error(error)

    }

  }

  return record;
};


const get = async (id: number, user: User) => {
  const wordsCountPromise = getRepository(Word).count({ where: { wordlistId: id } })
  const wordlistPromise = getRepository(Wordlist).findOne(id)
  const [wordsCount, wordlist] = await Promise.all([wordsCountPromise, wordlistPromise])
  return { ...wordlist, wordsCount }
};

const getWithWords = async (id: number, user: User) =>
  getRepository(Wordlist).findOne(id, { relations: ["words"] });

const update = async (id: number, updateObj: DeepPartial<Wordlist>) =>
  getRepository(Wordlist).update(id, updateObj);

const remove = async (id: number) =>  getRepository(Wordlist).delete(id)

/**
 * Checks if a string contains a valid binary file
 *
 * @param {String} base64EncodedFile A base 64 encoded binary file
 * @returns {{fileType: String, buffer: Buffer}} a object identifying the file type and the buffer
 */
const __parseBase64EncodedFile = (base64EncodedFile: string) => {
  const regex = /data:(\S+);base64,(\S+)/;
  const isString = typeof base64EncodedFile == "string";

  if (!isString || !regex.test(base64EncodedFile)) {
    logger.debug("Invalid base64 encoded file was sent");
    logger.debug(base64EncodedFile);
    throw new Error("Invalid file");
  }

  const [, fileType, data] = regex.exec(base64EncodedFile) ?? [];
  const buffer = Buffer.from(data, "base64");
  return { fileType, buffer };
};
/**
 * Extract words from a buffer
 *
 * @param {Buffer} buffer A buffer object representing a binary file
 * @returns {Pomise<Array<String>>} a promise which resolves to a set of words found in the buffer passed as argument
 */
const __extractWordsFromBuffer = async (
  buffer: Buffer,
  fileType: string
): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    //TODO<backend> buffer size should be bigger for paying users
    const options = {
      preserveLineBreaks: false,
      exec: { maxBuffer: 2 * 1024 * 1024 }
    };
    //@ts-ignore
    textract.fromBufferWithMime(fileType, buffer, options, function (
      error,
      text
    ) {
      if (error) {
        logger.error(`Error while extracting text from a ${fileType}`, error);
        reject(error);
      } else {
        const allWords = text
          .toLowerCase()
          .split(/\s+/)
          .map(word => word.trim())
          .filter(string => string.length > 0);
        resolve(allWords);
      }
    });
  });
};

/**
 * Remove non alpha numeric characteres and lower cases the word
 *
 * @param {String} word The word to be formatted
 */
const __formatWord = (word: string): string => {
  if (!word) return "";

  return word
    .replace(/<\S+[^>]*>/gi, "")
    .replace(/<\/\S+>/gi, "")
    .replace(/[[\]#\$(),;{}:."?!_=&]/g, "")
    .replace(/^'/, "")
    .replace(/'$/, "")
    .replace(/^\d+$/g, "") // just numbers? fuck
    .toLowerCase()
    .trim();
};

export default {
  list,
  save,
  get,
  getWithWords,
  update,
  delete: remove
};

