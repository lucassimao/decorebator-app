import { getRepository } from "typeorm";
import Image from "../entities/image";
import User from "../entities/user";
import filestorageService from "./filestorage.service";

type ImageDTO = { fileName: string; base64Image: string; description: string };

const addImage = async (
  idWordlist: number,
  wordId: number,
  { fileName, base64Image, description }: ImageDTO,
  user: User
) => {
const repository = getRepository(Image);

  const url = await filestorageService.store(user, fileName, base64Image);
  return repository.save({ wordId, url, description });
};

const deleteImage = (
  idWordlist: number,
  idWord: number,
  idImage: number,
  user: User
) => {
const repository = getRepository(Image);

  return repository.delete(idImage);
};

const patchImage = (
  idWordlist: number,
  idWord: number,
  idImage: number,
  imageDTO: Partial<Image>,
  user: User
) => {
const repository = getRepository(Image);

  return repository.update(idImage, imageDTO);
};

module.exports = { addImage, deleteImage, patchImage };
