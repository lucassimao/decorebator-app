import { LanguageCode } from "./languageCode";
import NewsSource from "./newsSource";


type NewsTopicPayload = {
    id?: number;
    languageCode: LanguageCode;
    name: string;
    source: NewsSource;
}

export default NewsTopicPayload