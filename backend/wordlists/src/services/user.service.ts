import { getRepository } from "typeorm";
import User from "../entities/user";

const repository = getRepository(User);

const getById = async (id: number) => repository.findOneOrFail(id);

export default {
  getById
};
