import { getRepository } from "typeorm";
import User from "../entities/user";
import Word from "../entities/word";
import logger from "../logger";

const repository = getRepository(Word);

const get = async (idWordlist: number, idWord: number, user: User) =>
  repository.findOne(idWord);

const getWithImages = async (idWordlist: number, idWord: number, user: User) =>
  repository.findOne(idWord, { relations: ["images"] });

const getWords = async (
  wordlistId: number,
  user: User,
  skip: number,
  limit: number
) => {
  if (Number.isInteger(skip) && Number.isInteger(limit)) {
    return repository.find({ where: { wordlistId }, skip, take: limit });
  } else {
    logger.warn(
      `Ignoring pagination args: idWordlist ${wordlistId} skip: ${skip} limit: ${limit}`
    );
    return repository.find({ where: { wordlistId } });
  }
};

const addWord = async (
  wordlistId: number,
  wordDTO: Partial<Word>,
  user: User
) => repository.save({ ...wordDTO, wordlistId });

const patchWord = (
  idWordlist: number,
  idWord: number,
  wordDTO: Partial<Word>,
  user: User
) => repository.update(idWord, wordDTO);

const deleteWord = (idWordlist: number, idWord: number, user: User) =>
  repository.delete(idWord);

const getAllWordsByUser = async (userId: number): Promise<Array<string>> => {
  return repository
    .createQueryBuilder("word")
    .select("name")
    .distinct()
    .innerJoin("word.wordlist", "wordlist")
    .where("wordlist.ownerId=:userId", { userId })
    .getRawMany<string>();
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
