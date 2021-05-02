import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import NewsArticle from '../types/newsArticle';

const elasticSearchHost = process.env.ELASTIC_SEARCH_HOST;
if (!elasticSearchHost) {
    throw new Error('ELASTIC_SEARCH_HOST is required')
}

const MINIMUM_EXPECTED_RESULTS = 50;

export default class ElasticSearchService {

    constructor(private logger: Logger) { }

    async hasEnough(lemma: string, languageCode: string): Promise<boolean> {
        const client = new Client({ node: elasticSearchHost })
        let query
        if (lemma.split(' ').length > 1) {
            query = { "match_phrase": { "content": lemma } }
        } else {
            query = { "match": { "content": lemma } }
        }
        const { body, statusCode } = await client.search({
            index: `decorebator-${languageCode}`,
            body: {
                size: 0,
                query,
                track_total_hits: MINIMUM_EXPECTED_RESULTS,
                _source: false
            }
        })


        const { value, relation } = body.hits.total;
        this.logger.debug(`Counting ${lemma}(${languageCode}): ${relation} ${value}`)
        return relation === 'gte' && value === MINIMUM_EXPECTED_RESULTS;
    }

    async insert(article: NewsArticle, languageCode: string): Promise<void> {
        const client = new Client({ node: elasticSearchHost })
        this.logger.debug(`indexing article`,{article: article.link});

        await client.index({
            index: `decorebator-${languageCode}`,
            body: article,
            pipeline: 'decorebator'
        })

    }

    async bulkInsert(articles: NewsArticle[], languageCode: string): Promise<void> {
        const client = new Client({ node: elasticSearchHost })
        this.logger.debug(`Bulk indexing ${articles.length} articles`);

        const result = await client.helpers.bulk({
            datasource: articles,
            onDocument() {
                return {
                    index: { _index: `decorebator-${languageCode}` }
                }
            },
            pipeline: 'decorebator'

        })
        this.logger.debug(`Bulk indexing result`,{result});
    }
}