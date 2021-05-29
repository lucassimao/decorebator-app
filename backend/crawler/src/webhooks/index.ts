import { Router } from "express";
import { newsCrawler } from "./news";
import {
  oxfordDictionaryCrawler
} from "./oxfordDictionary";
import { wordsApiCrawler } from "./wordsApi";
import { newsFanOut } from "./newsFanOut";


export const router = Router();
router.post("/words/oxforddictionaries", oxfordDictionaryCrawler);
router.post("/words/wordsApi", wordsApiCrawler);
router.post("/words/newsFanOut", newsFanOut);
router.post("/words/news", newsCrawler);
