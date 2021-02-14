import { Request, Response } from "express";
import { createHttpRequestLogger } from "../logger";
import WordApiService from "../services/wordApi.service";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";


export const wordsApiCrawler = async (req: Request, response: Response): Promise<void> => {
    const logger = await createHttpRequestLogger(req);
    const pubSubMessage: PubSubMessage = req.body?.message;

    if (!pubSubMessage) {
        response.sendStatus(400);
        return;
    }

    let word: WordDTO
    try {
        word = JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString());
    } catch (error) {
        logger.error('Error while decoding body', error);
        response.sendStatus(400);
        return;
    }

    if (!['en', 'en-us', 'en-uk'].includes(word.languageCode.toLocaleLowerCase())) {
        throw new Error(`Invalid languageCode ${word.languageCode}`);
    }

    try {
        const sevice = new WordApiService(logger);
        const result = await sevice.search(word.name,'en');
        await sevice.mapResultToLemmas(word, result)
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(500);
    }

}