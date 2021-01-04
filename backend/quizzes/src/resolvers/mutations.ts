import {
  MutationSaveQuizzGuessArgs,
  ResolversParentTypes,
} from "../generated/graphql";
import QuizzService from "../services/quizz.service";

export const saveQuizzGuess = async (
  parent: ResolversParentTypes["Mutation"],
  args: MutationSaveQuizzGuessArgs
): Promise<boolean> => {
  await QuizzService.registerGuess(parseInt(args.quizzId), args.success);
  return true;
};
