import { PubSub } from "@google-cloud/pubsub";
import { Request, Response } from "express";
import { createHttpRequestLogger } from "../logger";
import { LanguageToNewsSourceMapping } from "../types/newsSource";
import NewsTopicPayload from "../types/newsTopicPayload";
import { WordDTO } from "../types/word.dto";

const topic: string = process.env.PUB_SUB_NEWS_FAN_OUT_TOPIC ?? "";
if (!topic) {
    throw new Error("PUB_SUB_NEWS_FAN_OUT_TOPIC is required");
}

function enumKeys<O extends Record<string, unknown>, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

/**
 * Topic words-production dispatches a request to craw pages containing a word
 * and this endpoint publishes messages to the topic *news-production*
 * requesting the crawling of the same word in a specific website
 *
 * @param req 
 * @param response 
 * @returns 
 */
export const newsFanOut = async (
    req: Request,
    response: Response
): Promise<void> => {
    const logger = await createHttpRequestLogger(req);
    const word: WordDTO = (<any>req).payload;
    const pubSubClient = new PubSub();

    const tag = `${word.name}(${word.languageCode})`;
    logger.debug(`[${tag}] fanning out to Pub/Sub ...`);

    for (const source of enumKeys(LanguageToNewsSourceMapping[word.languageCode])) {
        const data: NewsTopicPayload = {
            ...word,
            source
        };
        const dataBuffer = Buffer.from(JSON.stringify(data));
        await pubSubClient.topic(topic).publish(dataBuffer);
    }

    response.sendStatus(200);
};
