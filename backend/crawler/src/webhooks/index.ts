import { Router } from "express";
import { oxfordDictionaryCrawler } from "./oxfordDictionary";

export const router = Router();
router.post('/words/oxforddictionaries',oxfordDictionaryCrawler)
