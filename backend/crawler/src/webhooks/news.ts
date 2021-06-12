import { Request, Response } from "express";
import { createHttpRequestLogger } from "../logger";
import ElasticSearchService from "../services/elasticSearch.service";
import NewsCrawlerService from "../services/newsCrawlerService";
import NewsArticle from "../types/newsArticle";
import NewsTopicPayload from "../types/newsTopicPayload";

export const newsCrawler = async (
  req: Request,
  response: Response
): Promise<void> => {
  const logger = await createHttpRequestLogger(req);
  const payload: NewsTopicPayload = (<any>req).payload;

  const elasticSearchService = new ElasticSearchService(logger);
  const tag = `[${payload.name}(${payload.languageCode})(${payload.source})]`

  try {
    const hasEnough = await elasticSearchService.hasEnough(
      payload.name,
      payload.languageCode
    );
    if (hasEnough) {
      logger.debug(`${tag} has enough data ... skiping`);
      response.sendStatus(200);
      return
    }

    const generator = new NewsCrawlerService(logger).getLatestNewsForWord(
      payload.name,
      payload.source
    );
    const articles: NewsArticle[] = [];

    for await (const article of generator) {
      articles.push(article);
    }

    // const wikiGenerator = new WikipediaService(logger).getArticlesForWord(payload.name);
    // for await (const article of wikiGenerator) {
    // articles.push(article);
    // }

    elasticSearchService.bulkInsert(articles, payload.languageCode);
    response.sendStatus(200);
  } catch (error) {
    logger.error("Error while processing word", error);
    response.sendStatus(500);
  }
};
