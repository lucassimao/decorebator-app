import Quizz from "../entities/quizz";

export default interface QuizzWithOptions<T> {
  quizz: Quizz;
  options: T[];
  rightOptionIdx: number;
  text?: string;
  audioFile?: string;
}
