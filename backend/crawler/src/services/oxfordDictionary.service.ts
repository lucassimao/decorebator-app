import { PubSub } from '@google-cloud/pubsub';
import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import Lemma from "../entities/lemma";
import Pronunciation from "../entities/Pronunciation";
import Sense from "../entities/sense";
import defaultLogger from "../logger";
import LemmaService from "../services/lemma.service";
import { LanguageCode } from "../types/languageCode";
import { Lemmatron } from "../types/lemmatron";
import { RetrieveEntry } from "../types/retrieveEntry";
import { WordDTO } from "../types/word.dto";
import winston from 'winston';



const appId = process.env.OXFORD_DICTIONARIES_APP_ID;
if (!appId) {
    throw new Error('OXFORD_DICTIONARIES_APP_ID is required')
}
const appKey = process.env.OXFORD_DICTIONARIES_APP_KEY;
if (!appKey) {
    throw new Error('OXFORD_DICTIONARIES_APP_KEY is required')
}

const topic: string = process.env.PUB_SUB_WORDS_TOPIC ?? ''
if (!topic) {
    throw new Error('PUB_SUB_WORDS_TOPIC is required')
}

const axiosConfig: AxiosRequestConfig = {
    baseURL: 'https://od-api.oxforddictionaries.com',
    headers: {
        'app_id': appId,
        'app_key': appKey
    },
};

const pubSubClient = new PubSub();

function __notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

async function __findLemmaOrSaveAsOutdated(name: string, language: string, provider: string, customLogger? : winston.Logger ): Promise<Lemma | null> {
    const logger = customLogger ?? defaultLogger;
    let lemma = await LemmaService.findOneBy({ name, language, provider })
    if (!lemma && language.includes('-')) {
        lemma = await LemmaService.findOneBy({ name, language: language.split('-')[0], provider })
    }
    if (lemma) {
        return lemma
    }

    const word: WordDTO = { languageCode: language as LanguageCode, name: name }
    const dataBuffer = Buffer.from(JSON.stringify(word));
    const tag = `${name}(${language})`;

    try {
        logger.debug(`[${tag}] publishing to Pub/Sub ...`)
        await pubSubClient.topic(topic).publish(dataBuffer);

        // it creates a new lemma, but saves it as 'outdated' to force a refresh when the word comes from pubsub
        return LemmaService.save({
            updatedAt: moment().subtract(100, 'days').toDate(),
            provider, name, language, lexicalCategory: 'unknow'
        })

    } catch (error) {
        logger.error(error, { name, language, provider });
        return null
    }
}


const OxfordDictionaryService = {
    async searchEntry(word: string, languageCode: LanguageCode): Promise<RetrieveEntry> {
        const filters = '?lexicalEntries&'
        const path = `/api/v2/entries/${languageCode}/${encodeURIComponent(word)}`;
        const response = await axios.get(path, axiosConfig)
        const retrieveEntry: RetrieveEntry = response.data;
        return retrieveEntry;
    },

    async searchLemma(word: string, languageCode: LanguageCode): Promise<Lemmatron> {
        const path = `/api/v2/lemmas/${languageCode}/` + encodeURIComponent(word);
        const response = await axios.get(path, axiosConfig)
        const lemmatron: Lemmatron = response.data;
        return lemmatron;
    },

    async pushPlaceholdersToPubSub( customLogger? : winston.Logger): Promise<void> {
        const logger = customLogger ?? defaultLogger;

        const placeholders = await LemmaService.getPlaceholders()
        for (const placeholder of placeholders) {
            if (!placeholder.name) continue;

            const word: WordDTO = { languageCode: placeholder.language as LanguageCode, name: placeholder.name }
            const dataBuffer = Buffer.from(JSON.stringify(word));
            const tag = `${word.name}(${word.languageCode})`;

            logger.debug(`[${tag}] publishing placeholder to Pub/Sub ...`)
            await pubSubClient.topic(topic).publish(dataBuffer);
        }
    }
    ,

    async mapRetrieveEntryToLemmas(searchEntryResponse: RetrieveEntry, word: WordDTO,customLogger? : winston.Logger): Promise<void> {
        const provider = searchEntryResponse.metadata.provider as string
        const tag = `${word.name}(${word.languageCode})`;
        const logger = customLogger ?? defaultLogger;


        for (const headwordEntry of searchEntryResponse.results) {
            logger.debug(`[${tag}] found ${headwordEntry.lexicalEntries?.length ?? 0} lexical entries ...`);

            for (const lexicalEntry of headwordEntry.lexicalEntries) {

                const { text: name, language, lexicalCategory: { id: lexicalCategory } } = lexicalEntry;
                let existingLemma = await LemmaService.findOneBy({ name, language, lexicalCategory })
                if (!existingLemma) {
                    existingLemma = await LemmaService.findOneBy({ name, lexicalCategory: 'unknow' })
                }


                const pronunciations: Pronunciation[] = []
                const senses: Sense[] = []
                const phrases = lexicalEntry.phrases?.map(phrase => phrase.text)
                const phrasalVerbs: Lemma[] = [];

                for (const phrasalVerb of (lexicalEntry.phrasalVerbs ?? [])) {
                    if (phrasalVerb.text === lexicalEntry.text) continue;
                    const lemma = await __findLemmaOrSaveAsOutdated(phrasalVerb.text, language, provider, logger)
                    if (lemma) {
                        phrasalVerbs.push(lemma)
                    }
                }

                logger.debug(`[${tag}] found ${phrasalVerbs.length} phrasal verbs ...`);


                logger.debug(`[${tag}] found ${lexicalEntry.entries?.length ?? 0} entries ...`);

                for (const entry of lexicalEntry.entries ?? []) {
                    logger.debug(`[${tag}] found ${entry.pronunciations?.length ?? 0} pronunciations ...`);

                    entry.pronunciations?.forEach(pronunciation => pronunciations.push({
                        audioFile: pronunciation.audioFile,
                        dialects: pronunciation.dialects,
                        phoneticNotation: pronunciation.phoneticNotation,
                        phoneticSpelling: pronunciation.phoneticSpelling,
                    })) ?? []

                    logger.debug(`[${tag}] found ${entry.senses?.length ?? 0} senses ...`);

                    for (const sense of (entry.senses ?? [])) {
                        const definitions = sense.definitions
                        const examples = sense.examples?.map(example => example.text)
                        const shortDefinitions = sense.shortDefinitions
                        const synonyms: Lemma[] = [];
                        for (const synonym of (sense.synonyms ?? [])) {
                            if (synonym.text === lexicalEntry.text || synonyms.find(s => s.name === synonym.text)) continue;
                            const lemma = await __findLemmaOrSaveAsOutdated(synonym.text, language, provider, logger)
                            if (lemma) {
                                synonyms.push(lemma)
                            }
                        }

                        logger.debug(`[${tag}] found ${synonyms.length} synonyms ...`);

                        let antonyms: Lemma[] = [];
                        if (sense.antonyms?.length) {
                            const results = await Promise.all(sense.antonyms.map(antonym => __findLemmaOrSaveAsOutdated(antonym.text, language, provider, logger)))
                            antonyms = results.filter(__notEmpty)
                        }

                        logger.debug(`[${tag}] found ${antonyms.length} antonyms ...`);
                        senses.push({ definitions, examples, shortDefinitions, synonyms, antonyms })
                    }

                }

                // plural?

                await LemmaService.save({
                    ...existingLemma,
                    phrases: [...(existingLemma?.phrases ?? []), ...(phrases ?? [])],
                    name: lexicalEntry.text, language: lexicalEntry.language,
                    lexicalCategory: lexicalEntry.lexicalCategory.id,
                    provider: searchEntryResponse.metadata.provider as string,
                    pronunciations, senses,
                    phrasalVerbs
                })
                logger.debug(`[${tag}] lemma saved`);

            }
        }

    }
}
export default OxfordDictionaryService;