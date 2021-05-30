import { Request, Response } from "express";
import { createHttpRequestLogger } from "../logger";
import ElasticSearchService from "../services/elasticSearch.service";
import NewsCrawlerService from "../services/newsCrawlerService";
import WikipediaService from "../services/wikipediaService";
import WordService from "../services/word.service";
import NewsArticle from "../types/newsArticle";
import NewsTopicPayload from "../types/newsTopicPayload";
import { PubSubMessage } from "../types/pubSubMessage";

export const newsCrawler = async (
  req: Request,
  response: Response
): Promise<void> => {
  const logger = await createHttpRequestLogger(req);
  const pubSubMessage: PubSubMessage = req.body?.message;

  if (!pubSubMessage) {
    response.sendStatus(204);
    return;
  }

  let payload: NewsTopicPayload;
  try {
    payload = JSON.parse(Buffer.from(pubSubMessage.data, "base64").toString());
  } catch (error) {
    logger.error("Error while decoding body", error);
    response.sendStatus(204);
    return;
  }

  if (!(await WordService.exists(payload.id))) {
    response.sendStatus(204);
    return
  }
  const elasticSearchService = new ElasticSearchService(logger);
  try {
    const hasEnough = await elasticSearchService.hasEnough(
      payload.name,
      payload.languageCode
    );
    if (!hasEnough) {
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
    } else {
      logger.debug(`${payload.name} has enough data ... skiping`);
    }
    response.sendStatus(200);
  } catch (error) {
    logger.error("Error while processing word", error);
    response.sendStatus(500);
  }
};
