import { LanguageCode } from "./languageCode";
import EnglishNewsSource from "./englishNewsSource";

type NewsTopicPayload = {
    id?: number;
    languageCode: LanguageCode;
    name: string;
    source: EnglishNewsSource;
}

export default NewsTopicPayload