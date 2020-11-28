import { Router } from "express";
import { oxfordDictionaryCrawler,pushPlaceholdersToPubSub } from "./oxfordDictionary";

export const router = Router();
router.post('/words/oxforddictionaries',oxfordDictionaryCrawler)
router.post('/words/pushPlaceholdersToPubSub',pushPlaceholdersToPubSub)

