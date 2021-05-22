import puppeteer, { Browser } from "puppeteer";
import { Logger } from "winston";
import NewsArticle from "../types/newsArticle";

type Mapping = {
  [newsOutlet: string]: {
    url: (word: string) => string;
    searchResultItemSelector: string;
    contentSelector: string;
  };
};
const mapping: Mapping = {
  HITHER_AND_THITHER: {
    url: (word: string) =>
      `https://hitherandthither.net/?s=${encodeURIComponent(word)}`,
    searchResultItemSelector: "li.grid-element a",
    contentSelector: "div.post-body p",
  },

  WALL_STREET_JOURNAL: {
    url: (word: string) =>
      `https://www.wsj.com/search?isToggleOn=true&operator=AND&sort=date-desc&duration=1y&query=${encodeURIComponent(
        word
      )}`,
    searchResultItemSelector:
      'article[class*="WSJTheme--story"] h3[class*="WSJTheme--headline"] a',
    contentSelector: "main .wsj-snippet-body",
  },
  READING_MY_TEA_LEAVES: {
    url: (word: string) =>
      `https://readingmytealeaves.com/?s=${encodeURIComponent(word)}`,
    searchResultItemSelector: "div.post-header h2 a",
    contentSelector: "div.post-entry p",
  },
  THE_NEW_YORKER: {
    url: (word: string) =>
      `https://www.newyorker.com/search/q/${encodeURIComponent(word)}/n,n`,
    searchResultItemSelector: 'ul[class*="River__list__"] li a:not([title])',
    contentSelector: "div.article__body",
  },
  POLITICO: {
    url: (word: string) =>
      `https://www.politico.com/search?q=${encodeURIComponent(
        word
      )}&adv=true&s=newest`,
    searchResultItemSelector: "ul.story-frag-list li h3 a",
    contentSelector: "div.story-text",
  },
  NY_TIMES: {
    url: (word: string) =>
      `https://www.nytimes.com/search?dropmab=false&sort=newest&query=${encodeURIComponent(
        word
      )}`,
    searchResultItemSelector: 'ol[data-testid="search-results"] li a',
    contentSelector: "p.g-body",
  },
};

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
  static browser: Browser;

  constructor(private logger: Logger) { }

  async *getLatestNewsForWord(word: string): AsyncGenerator<NewsArticle> {
    if (!NewsCrawlerService.browser) {
      NewsCrawlerService.browser = await puppeteer.launch({
        executablePath: process.env.CHROMIUM_PATH,
        headless: true,
        args: [
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
      });
    }


    const page = await NewsCrawlerService.browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", onRequestInterceptor);
    page.setViewport({ width: 1800, height: 800, isMobile: false });

    let searchUrl;
    for (const newsOutlet in mapping) {
      try {
        const { url, searchResultItemSelector, contentSelector } = mapping[
          newsOutlet
        ];

        searchUrl = url(`"${word}"`);
        this.logger.debug(`Searching for ${word} at ${newsOutlet} ...`, {
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
          `Found ${links.length} results for ${word} at ${newsOutlet} ...`
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

        this.logger.debug(`Finshed fetching ${newsOutlet} ...`);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          await page.screenshot({ path: "/tmp/screenshot.png" });
        }
        this.logger.error(
          `Error while searching for ${word} at ${newsOutlet} ...`,
          { searchUrl, error }
        );
      }
    }
    // browser.close();
  }
}
