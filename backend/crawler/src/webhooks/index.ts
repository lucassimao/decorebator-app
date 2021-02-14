import { Router } from "express";
import { oxfordDictionaryCrawler,pushPlaceholdersToPubSub } from "./oxfordDictionary";
import { wordsApiCrawler } from "./wordsApi";

export const router = Router();
router.post('/words/oxforddictionaries',oxfordDictionaryCrawler)
router.post('/words/pushPlaceholdersToPubSub',pushPlaceholdersToPubSub)
router.post('/words/wordsApi',wordsApiCrawler)

