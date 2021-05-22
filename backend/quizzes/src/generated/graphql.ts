/* eslint-disable */
import { GraphQLResolveInfo } from "graphql";
import { Context } from "../resolvers/context";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum QuizzType {
  Synonym = "SYNONYM",
  WordFromMeaning = "WORD_FROM_MEANING",
  MeaningFromWord = "MEANING_FROM_WORD",
  FillSentence = "FILL_SENTENCE",
  FillNewsSentence = "FILL_NEWS_SENTENCE",
  PhrasalVerb = "PHRASAL_VERB",
  Preposition = "PREPOSITION",
  WordFromAudio = "WORD_FROM_AUDIO",
}

export type Lemma = {
  __typename?: "Lemma";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type Word = {
  __typename?: "Word";
  id: Scalars["ID"];
  name: Scalars["String"];
  lexicalCategory?: Maybe<Scalars["String"]>;
};

export type Sentence = {
  __typename?: "Sentence";
  text: Scalars["String"];
  href: Scalars["String"];
};

export type QuizzInput = {
  types?: Maybe<Array<Maybe<QuizzType>>>;
  wordlistId?: Maybe<Scalars["ID"]>;
};

export type Option = Lemma | Sentence;

export type Quizz = {
  __typename?: "Quizz";
  id: Scalars["ID"];
  type: QuizzType;
  options: Array<Maybe<Option>>;
  rightOptionIdx: Scalars["Int"];
  word?: Maybe<Word>;
  text?: Maybe<Scalars["String"]>;
  audioFile?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  nextQuizz: Quizz;
};

export type QueryNextQuizzArgs = {
  input?: Maybe<QuizzInput>;
};

export type Mutation = {
  __typename?: "Mutation";
  saveQuizzGuess?: Maybe<Scalars["Boolean"]>;
};

export type MutationSaveQuizzGuessArgs = {
  quizzId: Scalars["ID"];
  success: Scalars["Boolean"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  QuizzType: QuizzType;
  Lemma: ResolverTypeWrapper<Lemma>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Word: ResolverTypeWrapper<Word>;
  Sentence: ResolverTypeWrapper<Sentence>;
  QuizzInput: QuizzInput;
  Option: ResolversTypes["Lemma"] | ResolversTypes["Sentence"];
  Quizz: ResolverTypeWrapper<
    Omit<Quizz, "options"> & { options: Array<Maybe<ResolversTypes["Option"]>> }
  >;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Lemma: Lemma;
  ID: Scalars["ID"];
  String: Scalars["String"];
  Word: Word;
  Sentence: Sentence;
  QuizzInput: QuizzInput;
  Option: ResolversParentTypes["Lemma"] | ResolversParentTypes["Sentence"];
  Quizz: Omit<Quizz, "options"> & {
    options: Array<Maybe<ResolversParentTypes["Option"]>>;
  };
  Int: Scalars["Int"];
  Query: {};
  Mutation: {};
  Boolean: Scalars["Boolean"];
};

export type LemmaResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Lemma"] = ResolversParentTypes["Lemma"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Word"] = ResolversParentTypes["Word"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lexicalCategory?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SentenceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Sentence"] = ResolversParentTypes["Sentence"]
> = {
  text?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  href?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Option"] = ResolversParentTypes["Option"]
> = {
  __resolveType: TypeResolveFn<"Lemma" | "Sentence", ParentType, ContextType>;
};

export type QuizzResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Quizz"] = ResolversParentTypes["Quizz"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["QuizzType"], ParentType, ContextType>;
  options?: Resolver<
    Array<Maybe<ResolversTypes["Option"]>>,
    ParentType,
    ContextType
  >;
  rightOptionIdx?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  word?: Resolver<Maybe<ResolversTypes["Word"]>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  audioFile?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  nextQuizz?: Resolver<
    ResolversTypes["Quizz"],
    ParentType,
    ContextType,
    RequireFields<QueryNextQuizzArgs, never>
  >;
};

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  saveQuizzGuess?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSaveQuizzGuessArgs, "quizzId" | "success">
  >;
};

export type Resolvers<ContextType = Context> = {
  Lemma?: LemmaResolvers<ContextType>;
  Word?: WordResolvers<ContextType>;
  Sentence?: SentenceResolvers<ContextType>;
  Option?: OptionResolvers<ContextType>;
  Quizz?: QuizzResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
