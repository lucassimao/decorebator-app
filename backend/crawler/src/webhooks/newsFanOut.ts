import { Request, Response } from "express";
import { createHttpRequestLogger } from "../logger";
import NewsTopicPayload from "../types/newsTopicPayload";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";
import { PubSub } from "@google-cloud/pubsub";
import EnglishNewsSource from "../types/englishNewsSource";

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

    const pubSubClient = new PubSub();

    const tag = `${word.name}(${word.languageCode})`;
    logger.debug(`[${tag}] fanning out to Pub/Sub ...`);

    for (const key of enumKeys(EnglishNewsSource)) {
        const data: NewsTopicPayload = {
            ...word,
            source: EnglishNewsSource[key]
        };
        const dataBuffer = Buffer.from(JSON.stringify(data));
        await pubSubClient.topic(topic).publish(dataBuffer);
    }

    response.sendStatus(200);
};
