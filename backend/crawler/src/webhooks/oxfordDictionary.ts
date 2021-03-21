import { Request, Response } from "express";
import { Like } from "typeorm";
import { createHttpRequestLogger } from "../logger";
import LemmaService from "../services/lemma.service";
import OxfordDictionaryService from "../services/oxfordDictionary.service";
import WordService from "../services/word.service";
import { PubSubMessage } from "../types/pubSubMessage";
import { WordDTO } from "../types/word.dto";


export const pushPlaceholdersToPubSub = async (req: Request, response: Response): Promise<void> => {
    const logger = await createHttpRequestLogger(req);

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
    const logger = await createHttpRequestLogger(req);
    const pubSubMessage: PubSubMessage = req.body?.message;

    if (!pubSubMessage) {
        response.sendStatus(400);
        return;
    }

    let word: WordDTO
    try {
        word = JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString());
        word = {...word, name: word.name.toLowerCase()};
    } catch (error) {
        logger.error('Error while decoding body', error);
        response.sendStatus(400);
        return;
    }

    if (!['en','en-us','en-uk'].includes(word.languageCode.toLocaleLowerCase())) {
        throw new Error(`Invalid languageCode ${word.languageCode}`);
    }

    const tag = `${word.name}(${word.languageCode})`;

    let existingLemmas = await LemmaService.findAllBy({ name: word.name, language: Like(`${word.languageCode}%`)})
    const isRefreshRequired = !existingLemmas?.length || existingLemmas.some(lemma => lemma.isRefreshRequired())

    try {

        if (isRefreshRequired) {
            logger.debug(`[${tag}] Starting refresh  ...`)

            const searchEntryResponse = await OxfordDictionaryService.searchEntry(word.name, word.languageCode);
            if (searchEntryResponse){
                logger.debug(`[${tag}] found ${searchEntryResponse.results?.length ?? 0} head word entries ...`);
                existingLemmas = await OxfordDictionaryService.mapRetrieveEntryToLemmas(searchEntryResponse, word, logger)
            } else {
                logger.debug(`[${tag}] no entry, searching lemma ...`);
                const lemmatron = await OxfordDictionaryService.searchLemma(word.name,word.languageCode)
                const lemmas = lemmatron.results.flatMap(({lexicalEntries}) => lexicalEntries).flatMap(({inflectionOf}) => inflectionOf).map(({id}) =>id);
                for (const lemma of lemmas) {
                    const searchEntryResponse = await OxfordDictionaryService.searchEntry(lemma, word.languageCode);
                    if (!searchEntryResponse) continue;
                    const result = await OxfordDictionaryService.mapRetrieveEntryToLemmas(searchEntryResponse, word, logger)
                    existingLemmas = [...result,...existingLemmas];
                }
            }
    
        } else{
            logger.debug(`[${tag}] No refresh required  ...`)
        }        

        if (word.id) {
            await WordService.updateWordLemmas(word.id, existingLemmas)
        }

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