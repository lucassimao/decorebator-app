interface LexicalCategory {
    id:string,
    text:string,
}

interface Model2 {
    id:string,
    text:string,
}

interface Model1 {
    id:string,
    text:string,
    type: string
}
type GrammaticalFeaturesList = Model1[]
type InflectionsList = Model2[]

interface LemmatronLexicalEntry{
    grammaticalFeatures: GrammaticalFeaturesList
    inflectionOf: InflectionsList
    language: string
    lexicalCategory: LexicalCategory
    text: string
}
interface HeadwordLemmatron {
    id: string,
    language: string,
    lexicalEntries: LemmatronLexicalEntry[],
    type: 'headword' | 'inflection' | 'phrase',
    word: string // @deprecated
}
export interface Lemmatron {
    metadata: Record<string, unknown>,
    results: HeadwordLemmatron[]
}

