import { PubSub } from '@google-cloud/pubsub';
import { getRepository } from "typeorm";
import User from "../entities/user";
import Word from "../entities/word";
import Wordlist from "../entities/wordlist";
import logger from "../logger";


const topic: string = process.env.PUB_SUB_WORDS_TOPIC ?? ''
if (!topic) {
    throw new Error('PUB_SUB_WORDS_TOPIC is required')
}

const pubSubClient = new PubSub();


const get = async (idWordlist: number, idWord: number, user: User) =>
  getRepository(Word).findOne(idWord);

const getWithImages = async (idWordlist: number, idWord: number, user: User) =>
  getRepository(Word).findOne(idWord, { relations: ["images"] });

const getWords = async (
  wordlistId: number,
  user: User,
  skip: number,
  limit: number
) => {
  if (Number.isInteger(skip) && Number.isInteger(limit)) {
    return getRepository(Word).find({ where: { wordlistId }, skip, take: limit, order:{id:'ASC'} });
  } else {
    logger.warn(
      `Ignoring pagination args: idWordlist ${wordlistId} skip: ${skip} limit: ${limit}`
    );
    return getRepository(Word).find({ where: { wordlistId }, order:{id:'ASC'} });
  }
};

const addWord = async (
  wordlistId: number,
  wordDTO: Partial<Word>,
  user: User,
) => {
  const repository = getRepository(Word);
  const wordlistRepository = getRepository(Wordlist);

  const word = await repository.save({ ...wordDTO, wordlistId });
  const wordlist = await wordlistRepository.findOne(wordlistId,{select:['language']});
  const languageCode = wordlist?.language;

  try {
    const payload = {id: word.id, languageCode, name: word.name}
    const dataBuffer = Buffer.from(JSON.stringify(payload));
    logger.debug(`Publishing payload to Pub/Sub ...`)
    await pubSubClient.topic(topic).publish(dataBuffer);  
  } catch (error) {
    logger.error(error);
  }
  return word;
};

const patchWord = (
  idWordlist: number,
  idWord: number,
  wordDTO: Partial<Word>,
  user: User
) => getRepository(Word).update(idWord, wordDTO);

const deleteWord = (idWordlist: number, idWord: number, user: User) => getRepository(Word).delete(idWord);

const getAllWordsByUser = async (userId: number): Promise<Array<string>> => {
  const result = await getRepository(Word)
    .createQueryBuilder("word")
    .select("word.name")
    .distinct()
    .innerJoin("word.wordlist", "wordlist")
    .where("wordlist.ownerId=:userId", { userId })
    .getRawMany();

  return result.map(word => word.word_name)
};

export default {
  get,
  getWords,
  addWord,
  patchWord,
  delete: deleteWord,
  getWithImages,
  getAllWordsByUser
};
