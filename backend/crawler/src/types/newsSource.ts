
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

export enum GermanNewsSource {
    SPIEGEL = 'SPIEGEL',
    BILD = 'BILD',
    ZEIT = 'ZEIT'
}

export enum ItalianNewsSource {
    LA_REPUBLICA = 'LA_REPUBLICA',
    CORRIERE_DELLA_SERA = 'CORRIERE_DELLA_SERA'
}

export enum PortugueseNewsSource {
    FOLHA_DE_SAO_PAULO = 'FOLHA_DE_SAO_PAULO',
    ESTADAO = 'ESTADAO',
}

export enum SpanishNewsSource {
    EL_PAIS = 'EL_PAIS',
    EL_MUNDO = 'EL_MUNDO',
}

export const LanguageToNewsSourceMapping = {
    [LanguageCode.EN]: EnglishNewsSource,
    [LanguageCode.FR]: FrenchNewsSource,
    [LanguageCode.DE]: GermanNewsSource,
    [LanguageCode.IT]: ItalianNewsSource,
    [LanguageCode.PT]: PortugueseNewsSource,
    [LanguageCode.ES]: SpanishNewsSource,
}

type NewsSource = `${EnglishNewsSource | FrenchNewsSource | GermanNewsSource | ItalianNewsSource | PortugueseNewsSource | SpanishNewsSource}`
export default NewsSource