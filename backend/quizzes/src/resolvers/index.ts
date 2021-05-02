import { IResolvers } from "apollo-server-express";
import { Lemma, Sentence } from "../generated/graphql";
import { saveQuizzGuess } from "./mutations";
import { nextQuizz } from "./queries";

const resolvers: IResolvers = {
  Option: {
    __resolveType(option: Lemma | Sentence): string {
      if ("id" in option && "name" in option) return "Lemma";
      return "Sentence";
    },
  },
  QuizzType: {
    SYNONYM: "synonym",
    WORD_FROM_MEANING: "word_from_meaning",
    MEANING_FROM_WORD: "meaning_from_word",
    FILL_SENTENCE: "fill_sentence",
    FILL_NEWS_SENTENCE: "fill_news_sentence",
    PHRASAL_VERB: "phrasal_verb",
    PREPOSITION: "preposition",
    WORD_FROM_AUDIO: "word_from_audio",
  },
  Query: {
    nextQuizz,
  },
  Mutation: {
    saveQuizzGuess,
  },
};

export default resolvers;
