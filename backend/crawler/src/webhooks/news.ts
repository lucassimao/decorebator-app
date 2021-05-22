import { Request, Response } from "express";
import { createHttpRequestLogger } from "../logger";
import ElasticSearchService from "../services/elasticSearch.service";
import NewsCrawlerService from "../services/newsCrawlerService";
import NewsArticle from "../types/newsArticle";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";

export const newsCrawler = async (
  req: Request,
  response: Response
): Promise<void> => {
  const logger = await createHttpRequestLogger(req);
  const pubSubMessage: PubSubMessage = req.body?.message;

  if (!pubSubMessage) {
    response.sendStatus(400);
    return;
  }

  let word: WordDTO;
  try {
    word = JSON.parse(Buffer.from(pubSubMessage.data, "base64").toString());
    word = { ...word, name: word.name.toLowerCase() };
  } catch (error) {
    logger.error("Error while decoding body", error);
    response.sendStatus(400);
    return;
  }
  const elasticSearchService = new ElasticSearchService(logger);
  try {
    const hasEnough = await elasticSearchService.hasEnough(
      word.name,
      word.languageCode
    );
    if (!hasEnough) {
      const generator = new NewsCrawlerService(logger).getLatestNewsForWord(
        word.name
      );
      const articles: NewsArticle[] = [];
      for await (const article of generator) {
        articles.push(article);
      }
      elasticSearchService.bulkInsert(articles, word.languageCode);
    } else {
      logger.debug(`${word.name} has enough data ... skiping`);
    }
    response.sendStatus(200);
  } catch (error) {
    logger.error("Error while processing word", error);
    response.sendStatus(500);
  }
};
