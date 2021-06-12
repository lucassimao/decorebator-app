import puppeteer from "puppeteer";
import { Logger } from "winston";
import NewsSource from "../types/newsSource";
import fullMapping from "../types/newsSourceMapping";
import NewsArticle from "../types/newsArticle";


const onRequestInterceptor = (request: any) => {
  if (
    ["image", 'stylesheet', 'font'].includes(request.resourceType())
  ) {
    request.abort();
  } else {
    request.continue();
  }
};

export default class NewsCrawlerService {

  constructor(private logger: Logger) { }

  async *getLatestNewsForWord(word: string, newsOutlet: NewsSource): AsyncGenerator<NewsArticle> {

    const browser = await puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      headless: true,
      args: [
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });


    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", onRequestInterceptor);
    page.setViewport({ width: 1800, height: 800, isMobile: false });

    let searchUrl;

    try {
      const { url, searchResultItemSelector, contentSelector } = fullMapping[
        newsOutlet
      ];

      searchUrl = url(`"${word}"`);
      this.logger.debug(`[NewsCrawler] Searching for ${word} at ${newsOutlet} ...`, {
        searchUrl,
      });
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      const anchors = await page.$$(searchResultItemSelector);

      const links: string[] = [];
      for (const anchor of anchors) {
        const property = await anchor.getProperty("href");
        const value = (await property?.jsonValue()) as string;
        const link = value?.trim();
        links.push(link);
      }

      this.logger.debug(
        `[NewsCrawler] Found ${links.length} results for ${word} at ${newsOutlet} ...`
      );

      for (const link of links) {
        await page.goto(link, { waitUntil: 'domcontentloaded' });
        const contentElements = await page.$$(contentSelector);
        const textPieces = [];
        for (const element of contentElements) {
          const innerTextProperty = await element.getProperty("innerText");
          const innerText = (await innerTextProperty?.jsonValue()) as string;
          textPieces.push(innerText);
        }
        yield { content: textPieces.join("\n"), link };
      }

      this.logger.debug(`[NewsCrawler] Finshed fetching ${newsOutlet} ...`);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        await page.screenshot({ path: "/tmp/screenshot.png" });
      }
      this.logger.error(
        `[NewsCrawler] Error while searching for ${word} at ${newsOutlet} ...`,
        { searchUrl, error }
      );
    }

    browser.close();
  }
}
