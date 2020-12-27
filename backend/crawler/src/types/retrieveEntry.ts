type Model12 = {
    definitions?: string[]
    domains?: domainsList
    notes?: CategorizedTextList
    regions?: regionsList
    registers?: registersList
    senseIds?: string[]
    text: string
}
type ExamplesList = Model12[]

type Model6 = {
    id: string,
    text: string,
    type: string
}
type CrossReferencesList = Model6[]
type Model3 = {
    id: string,
    text: string,
    type: string
}
type GrammaticalFeaturesList = Model3[]
type lexicalCategory = {
    id: string,
    text: string
}
type Model4 = {
    id: string,
    text: string,
    type: string
}
type CategorizedTextList = Model4[]
type Model5 = {
    domains?: domainsList
    notes?: CategorizedTextList
    pronunciations?: PronunciationsList
    regions?: regionsList
    registers?: registersList
    text: string
}
type VariantFormsList = Model5[]

type Model7 = {
    id: string
    text: string
}
type Model8 = {
    id: string
    text: string
}
type Model9 = {
    id: string
    text: string
}
type regionsList = Model7[]
type registersList = Model8[]
type domainsList = Model9[]

type Model11 = {
    id: string
    text: string
}
type domainClassesList = Model11[]

type Model13 = {
    id:string
    text:string
}
type semanticClassesList = Model13[]

type Sense = {
    antonyms?: SynonymsAntonyms
    constructions?: InlineModel2
    crossReferenceMarkers?: string[]
    crossReferences?: CrossReferencesList
    definitions?: string[]
    domainClasses?: domainClassesList
    domains?: domainsList
    etymologies?: string[]
    examples?: ExamplesList
    id?: string
    inflections?: InflectedForm[]
    notes?: CategorizedTextList
    pronunciations?: PronunciationsList
    regions?: regionsList
    registers?: registersList
    semanticClasses?: semanticClassesList
    shortDefinitions?: string[]
    subsenses?: Sense[]
    synonyms?: SynonymsAntonyms
    thesaurusLinks?: thesaurusLink[]
    variantForms?: VariantFormsList
}

type thesaurusLink = {
    entry_id:string
    sense_id:string
}

type ExampleText = string;

type Model10 = {
    domains?: domainsList
    id?: string
    language: string
    regions?: regionsList
    registers?: registersList
    text: string
}
type SynonymsAntonyms = Model10[]

type InflectedForm = {
    domains?: domainsList
    grammaticalFeatures?: GrammaticalFeaturesList
    inflectedForm: string
    lexicalCategory?: lexicalCategory
    pronunciations?: PronunciationsList
    regions?: regionsList
    registers?: registersList
}

type Entry = {
    crossReferenceMarkers?: string[]
    crossReferences?: CrossReferencesList
    etymologies?: string[]
    grammaticalFeatures?: GrammaticalFeaturesList
    homographNumber?: string
    inflections?: InflectedForm
    notes?: CategorizedTextList
    pronunciations?: PronunciationsList
    senses?: Sense[]
    variantForms?: VariantFormsList
}

type Model1 = {
    audioFile?: string
    dialects?: string[]
    phoneticNotation?: string
    phoneticSpelling?: string
    regions?: regionsList
    registers?: registersList
}
type PronunciationsList = Model1[]

type Model2 = {
    domains?: domainsList
    id: string
    language?: string
    regions?: regionsList
    registers?: registersList
    text: string
}
type InlineModel2 = {
    domains?: domainsList
    examples?: ExampleText[]
    notes?: CategorizedTextList
    regions?: regionsList
    registers?: registersList
    text: string
}
export type ArrayOfRelatedEntries = Model2[]

interface LexicalEntry {
    compounds?: ArrayOfRelatedEntries
    derivativeOf?: ArrayOfRelatedEntries
    derivatives?: ArrayOfRelatedEntries
    entries?: Entry[]
    grammaticalFeatures?: GrammaticalFeaturesList
    language: string
    lexicalCategory: lexicalCategory
    notes?: CategorizedTextList
    phrasalVerbs?: ArrayOfRelatedEntries
    phrases?: ArrayOfRelatedEntries
    pronunciations?: PronunciationsList
    senses?: Sense[]
    root?: string
    text?: string
    variantForms?: VariantFormsList
}

interface HeadwordEntry {
    id: string
    language: string
    lexicalEntries: LexicalEntry[]
    pronunciations?: PronunciationsList
    type: 'headword' | 'inflection' | 'phrase'
    word: string
}

export interface RetrieveEntry {
    metadata: Record<string, unknown>,
    results: [HeadwordEntry]
}
