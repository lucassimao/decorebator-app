import { PubSub } from '@google-cloud/pubsub';
import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { In } from 'typeorm';
import Lemma from "../entities/lemma";
import Pronunciation from "../entities/Pronunciation";
import Sense from "../entities/sense";
import logger from "../logger";
import LemmaService from "../services/lemma.service";
import { LanguageCode } from "../types/languageCode";
import { Lemmatron } from "../types/lemmatron";
import { RetrieveEntry } from "../types/retrieveEntry";
import { WordDTO } from "../types/word.dto";



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

async function __findLemmaOrSaveAsOutdated(text: string, language: string, provider: string): Promise<Lemma | null> {
    const lemma = await LemmaService.findOneBy({name: text,language,provider})
    if (lemma) {
        return lemma
    }

    const word: WordDTO = { languageCode: language as LanguageCode, name: text }
    const dataBuffer = Buffer.from(JSON.stringify(word));
    const tag = `${text}(${language})`;

    try {
        logger.debug(`[${tag}] publishing to Pub/Sub ...`)
        await pubSubClient.topic(topic).publish(dataBuffer);

        // it creates a new lemma, but saves it as 'outdated' to force a refresh when the word comes from pubsub
        return LemmaService.save({
            updatedAt: moment().subtract(100, 'days').toDate(),
            provider: provider, lexicalCategory: 'unknow',
            name: text, language: language
        })

    } catch (error) {
        logger.error(error);
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
    }
    ,

    async mapRetrieveEntryToLemmas(searchEntryResponse: RetrieveEntry, word: WordDTO): Promise<void> {
        const tag = `${word.name}(${word.languageCode})`;

        for (const headwordEntry of searchEntryResponse.results) {

            logger.debug(`[${tag}] found ${headwordEntry.lexicalEntries?.length ?? 0} lexical entries ...`);

            for (const lexicalEntry of headwordEntry.lexicalEntries) {

                const pronunciations: Pronunciation[] = []
                const senses: Sense[] = []
                const phrases = lexicalEntry.phrases?.map(phrase => phrase.text)

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
                        const provider = searchEntryResponse.metadata.provider as string
                        let synonyms: Lemma[] = [];
                        if (sense.synonyms?.length) {
                            const results = await Promise.all(sense.synonyms.map(synonym => __findLemmaOrSaveAsOutdated(synonym.text, synonym.language, provider)))
                            synonyms = results.filter(__notEmpty)
                        }

                        logger.debug(`[${tag}] found ${synonyms.length} synonyms ...`);

                        let antonyms: Lemma[] = [];
                        if (sense.antonyms?.length) {
                            const results = await Promise.all(sense.antonyms.map(antonym => __findLemmaOrSaveAsOutdated(antonym.text, antonym.language, provider)))
                            antonyms = results.filter(__notEmpty)
                        }

                        logger.debug(`[${tag}] found ${antonyms.length} antonyms ...`);
                        senses.push({ definitions, examples, shortDefinitions, synonyms, antonyms })
                    }

                }

                // plural?
                // phrasal verbs
                const {text: name,language,lexicalCategory: {text: lexicalCategory}} = lexicalEntry;
                const existingLemma = await LemmaService.findOneBy({name,language,lexicalCategory: In([lexicalCategory, 'unknow'])})

                await LemmaService.save({
                    ...existingLemma,
                    phrases: [...(existingLemma?.phrases ?? []), ...(phrases ?? [])],
                    name: lexicalEntry.text, language: lexicalEntry.language,
                    lexicalCategory: lexicalEntry.lexicalCategory.id,
                    provider: searchEntryResponse.metadata.provider as string,
                    pronunciations, senses
                })
                logger.debug(`[${tag}] lemma saved`);

            }
        }

    }
}
export default OxfordDictionaryService;