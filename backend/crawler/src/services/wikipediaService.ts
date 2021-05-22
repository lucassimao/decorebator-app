/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Logger } from "winston";
import NewsArticle from "../types/newsArticle";
import wikijs from 'wikijs'

const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X; en-US) AppleWebKit/531.22.7 (KHTML, like Gecko) Version/3.0.5 Mobile/8B118 Safari/6531.22.7'

export default class WikipediaService {
    constructor(private logger: Logger) { }

    async *getArticlesForWord(word: string): AsyncGenerator<NewsArticle> {

        try {
            const client = wikijs({ headers: { 'user-agent': userAgent } })
            // @ts-ignore
            const { results } = await client.search(`"${word}"`, 10, true);
            this.logger.debug(`Found ${results?.length} results on wikipedia ...`)
            for (const result of results) {
                // @ts-ignore
                const { pageid } = result;
                const page = await client.findById(pageid)
                const content = await page.rawContent();
                yield { content, link: `https://en.wikipedia.org/?curid=${pageid}` }
            }
        } catch (error) {
            this.logger.error("problem with wikipedia...");
            this.logger.error(error);
            return
        }

    }

}