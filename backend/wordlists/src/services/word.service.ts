import { getRepository } from "typeorm";
import User from "../entities/user";
import Word from "../entities/word";
import logger from "../logger";


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
    return getRepository(Word).find({ where: { wordlistId }, skip, take: limit });
  } else {
    logger.warn(
      `Ignoring pagination args: idWordlist ${wordlistId} skip: ${skip} limit: ${limit}`
    );
    return getRepository(Word).find({ where: { wordlistId } });
  }
};

const addWord = async (
  wordlistId: number,
  wordDTO: Partial<Word>,
  user: User
) => getRepository(Word).save({ ...wordDTO, wordlistId });

const patchWord = (
  idWordlist: number,
  idWord: number,
  wordDTO: Partial<Word>,
  user: User
) => getRepository(Word).update(idWord, wordDTO);

const deleteWord = (idWordlist: number, idWord: number, user: User) =>
  getRepository(Word).delete(idWord);

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
