import { Client } from "@elastic/elasticsearch";
import { Logger } from "winston";

const elasticSearchHost = process.env.ELASTIC_SEARCH_HOST;
if (!elasticSearchHost) {
  throw new Error("ELASTIC_SEARCH_HOST is required");
}

export type ElasticSearchExample = {
  example: string;
  sort: number;
};

export default class ElasticSearchService {
  constructor(private logger: Logger) {}

  static async getExample(
    lemma: string,
    languageCode: string,
    searchAfter?: number
  ): Promise<ElasticSearchExample> {
    const client = new Client({ node: elasticSearchHost });
    let query;
    if (lemma.split(" ").length > 1) {
      query = { match_phrase: { content: lemma } };
    } else {
      query = { match: { content: lemma } };
    }

    const { body } = await client.search({
      index: `decorebator-${languageCode}`,
      body: {
        track_total_hits: false,
        _source: false,
        size: 1,
        query,
        highlight: {
          order: "score",
          boundary_scanner_locale: "en-US",
          boundary_scanner: "sentence",
          fields: {
            content: {
              type: "fvh",
            },
          },
        },
        sort: ["_doc"],
        search_after: searchAfter ? [searchAfter] : [0],
      },
    });

    const { hits } = body.hits;
    if (!hits?.length) {
      throw new Error("No hits");
    }
    if (!hits[0].highlight?.content) {
      throw new Error("no highlight");
    }
    return { example: hits[0].highlight.content[0], sort: hits[0].sort[0] };
  }
}
