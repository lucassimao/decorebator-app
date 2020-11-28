import { Request, Response } from "express";
import logger from "../logger";
import LemmaService from "../services/lemma.service";
import OxfordDictionaryService from "../services/oxfordDictionary.service";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";

export const pushPlaceholdersToPubSub = async (req: Request, response: Response): Promise<void> => {
    try {
        await OxfordDictionaryService.pushPlaceholdersToPubSub()
        response.sendStatus(200);
        return
    } catch (error) {
        logger.error('problem pushing placeholders ...')
        logger.error(error)
        response.sendStatus(500);
    }
}

export const oxfordDictionaryCrawler = async (req: Request, response: Response): Promise<void> => {
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

    const tag = `${word.name}(${word.languageCode})`;

    try {
        const existingLemmas = await LemmaService.findAllBy({name:word.name,language: word.languageCode})
        const canSkipRefresh = existingLemmas.length > 0 && existingLemmas.every(lemma => !lemma.isRefreshRequired())

        if (canSkipRefresh) {
            logger.debug(`[${tag}] existing lemmas are updated ...`);
            response.sendStatus(200);
            return;
        }

        logger.debug(`[${tag}] Starting processing  ...`)

        const searchEntryResponse = await OxfordDictionaryService.searchEntry(word.name, word.languageCode);
        logger.debug(`[${tag}] found ${searchEntryResponse.results?.length ?? 0} head word entries ...`);

        await OxfordDictionaryService.mapRetrieveEntryToLemmas(searchEntryResponse, word)
        response.sendStatus(200);

    } catch (error) {
        if (error.isAxiosError) {
            if (error.response) {
                const { response: { data, status, headers } } = error;
                logger.debug(`[${tag}] Request made and server responded with error ...`, { data, status, headers });
            } else if (error.request) {
                logger.error(`[${tag}] request was made but no response was received ...`, { request: error.request });
            } else {
                logger.error(`[${tag}] Something happened in setting up the request that triggered an Error ...`, { message: error.message });
            }

        } else {
            logger.error(error)
        }
        response.sendStatus(500);
        return;
    }

}