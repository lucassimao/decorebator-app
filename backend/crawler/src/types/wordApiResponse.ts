interface Result {
  definition: string;
  examples: string[];
  partOfSpeech: string;
  similarTo?: string[];
  synonyms?: string[];
  hasTypes?: string[];
  typeOf?: string[];
  instanceOf?: string[];
  partOf?: string[];
  hasInstances?: string[];
  hasParts?: string[];
  antonyms?: string[];
  verbGroup?: string[];
  also?: string[];
  inRegion?: string[];
  derivation?: string[];
  entails?: string[];
  memberOf?: string[];
  hasMembers?: string[];
  substanceOf?: string[];
  hasSubstances?: string[];
  inCategory?: string[];
  hasCategries?: string[];
  usageOf?: string[];
  hasUsages?: string[];
  regionOf?: string[];
  pertainsTo?: string[];
}

export interface ErrorResponse {
  message: string;
  success: boolean;
}
export interface SuccessfulReponse {
  frequency: number;
  pronunciation: Map<string, string>;
  results: Result[];
  word: string;
}

export type WordApiResponse = ErrorResponse | SuccessfulReponse;
