import { Request, Response } from "express";
import logger from "../logger";
import LemmaService from "../services/lemma.service";
import OxfordDictionaryService from "../services/oxfordDictionary.service";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";


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

    logger.debug(`[${tag}] Starting processing  ...`)

    const lemma = await LemmaService.findByNameAndLanguage(word.name, word.languageCode)

    if (lemma) {
        logger.debug(`[${tag}] Lemma already exists`);

        if (!lemma.isRefreshRequired()) {
            logger.debug(`[${tag}] Lemma is fresh, skipping ...`);
            response.sendStatus(200);
            return;
        }
    }

    const searchEntryResponse = await OxfordDictionaryService.searchEntry(word.name, word.languageCode);
    logger.debug(`[${tag}] found ${searchEntryResponse.results?.length ?? 0} head word entries ...`);

    await OxfordDictionaryService.mapRetrieveEntryToLemmas(searchEntryResponse, word, lemma)
    response.sendStatus(200);
}