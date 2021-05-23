import Lemma from "../entities/lemma";
import {
  Lemma as GraphQLLemma,
  Option as GraphQLOption,
  QueryNextQuizzArgs,
  Quizz as GraphQLQuizz,
  ResolversParentTypes,
  Sentence,
} from "../generated/graphql";
import QuizzService from "../services/quizz.service";
import { Context } from "./context";

const mapOptionsTo = (options: Array<string | Lemma>): GraphQLOption[] => {
  const result: GraphQLOption[] = [];

  for (const option of options) {
    if (typeof option === "string") {
      result.push({ text: option } as Sentence);
    } else {
      result.push({ id: String(option.id), name: option.name } as GraphQLLemma);
    }
  }
  return result;
};
export const nextQuizz = async (
  parent: ResolversParentTypes["Query"],
  args: QueryNextQuizzArgs,
  ctx: Context
): Promise<GraphQLQuizz> => {
  const userId = ctx.user.id;
  const result = await QuizzService.nextQuizz(
    userId,
    parseInt(args.input?.wordlistId ?? ""),
    args.input?.types as string[]
  );
  const { quizz, options, rightOptionIdx, text, audioFile } = result;
  const { word, sense } = quizz;

  return {
    id: String(quizz.id),
    options: mapOptionsTo(options),
    type: quizz.type,
    rightOptionIdx,
    text,
    audioFile,
    word: {
      id: String(word?.id),
      name: String(word?.name),
      lemma: sense?.lemma
        ? { ...sense.lemma, id: String(sense.lemma.id) }
        : null,
    },
  };
};
