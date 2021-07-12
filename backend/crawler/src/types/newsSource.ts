
import { LanguageCode } from "./languageCode";

export enum EnglishNewsSource {
    HITHER_AND_THITHER = "HITHER_AND_THITHER",
    WALL_STREET_JOURNAL = "WALL_STREET_JOURNAL",
    READING_MY_TEA_LEAVES = "READING_MY_TEA_LEAVES",
    THE_NEW_YORKER = "THE_NEW_YORKER",
    POLITICO = "POLITICO",
    NY_TIMES = "NY_TIMES",
    NY_MAG = "NY_MAG"
}

export enum FrenchNewsSource {
    LE_MONDE = 'LE_MONDE',
    LE_FIGARO = 'LE_FIGARO',
}


export enum SpanishNewsSource {
    EL_PAIS = 'EL_PAIS',
    EL_MUNDO = 'EL_MUNDO',
}

export const LanguageToNewsSourceMapping = {
    [LanguageCode.EN]: EnglishNewsSource,
    [LanguageCode.FR]: FrenchNewsSource,
    [LanguageCode.ES]: SpanishNewsSource,
}

type NewsSource = `${EnglishNewsSource | FrenchNewsSource | SpanishNewsSource}`
export default NewsSource