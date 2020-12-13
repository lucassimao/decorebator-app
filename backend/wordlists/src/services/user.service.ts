import { getRepository } from "typeorm";
import User from "../entities/user";



const getById = async (id: number) => {
  const repository = getRepository(User);
  return repository.findOneOrFail(id)
};

export default {
  getById
};
