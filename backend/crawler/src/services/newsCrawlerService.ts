import puppeteer from 'puppeteer';
import { Logger } from 'winston';
import NewsArticle from '../types/newsArticle';

type Mapping = {
    [newsOutlet: string]: {url: (word: string) => string, searchResultItemSelector: string, contentSelector: string }
}
const mapping : Mapping = {
    // WASHINGTON_POST: {
    //     url: (word: string) => `https://www.washingtonpost.com/newssearch/?btn-search=&sort=Date&query=${encodeURIComponent(word)}&datefilter=All%20Since%202005`,
    //     selector: 'div.pb-feed-headline p a[data-ng-bind-html="doc.headline"]'
    // },

    WALL_STREET_JOURNAL: {
        url: (word: string) => `https://www.wsj.com/search?isToggleOn=true&operator=AND&sort=date-desc&duration=1y&query=${encodeURIComponent(word)}`,
        searchResultItemSelector: 'article[class*="WSJTheme--story"] h3[class*="WSJTheme--headline"] a',
        contentSelector: 'main .wsj-snippet-body'
    },
    THE_ECONOMIST: {
        url: (word: string) => `https://www.economist.com/search?sort=date&q=${encodeURIComponent(word)}`,
        searchResultItemSelector:'ol#search-results li a._search-result',
        contentSelector: 'p.article__body-text'
    },
    THE_NEW_YORKER: {
        url: (word: string) => `https://www.newyorker.com/search/q/${encodeURIComponent(word)}/n,n`,
        searchResultItemSelector: 'ul[class*="River__list__"] li a:not([title])',
        contentSelector: 'div.article__body'
    },
    POLITICO: {
        url: (word:string) => `https://www.politico.com/search?q=${encodeURIComponent(word)}&adv=true&s=newest`,
        searchResultItemSelector: 'ul.story-frag-list li h3 a',
        contentSelector: 'div.story-text'
    },
    NY_TIMES : {
        url: (word: string) => `https://www.nytimes.com/search?dropmab=false&sort=newest&query=${encodeURIComponent(word)}`, 
        searchResultItemSelector: 'ol[data-testid="search-results"] li a',
        contentSelector: 'p.g-body'
    }
} 

const onRequestInterceptor = (request: any) => {
    if (['image', /*'stylesheet', 'font', 'other'*/].indexOf(request.resourceType()) !== -1) {
        request.abort();
    } else {
        request.continue();
    }
}


export default class NewsCrawlerService{

    constructor(private logger: Logger){ }

    async *getLatestNewsForWord(word: string): AsyncGenerator<NewsArticle>{

        const browser = await puppeteer.launch({executablePath: process.env.CHROMIUM_PATH, headless: true, 
             args: ['--disable-dev-shm-usage','--no-sandbox','--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', onRequestInterceptor);        
        page.setViewport({ width: 1800, height: 800, isMobile: false })


        try {
            for (const newsOutlet in mapping) {

                const {url, searchResultItemSelector, contentSelector} = mapping[newsOutlet];
    
                const searchUrl = url(`"${word}"`)
                this.logger.debug(`Searching for ${word} at ${newsOutlet} ...`,{searchUrl});
                await page.goto(searchUrl);
                
                await page.waitForSelector(searchResultItemSelector)
                const anchors = await page.$$(searchResultItemSelector);
                
                const links: string[] = []
                for (const anchor of anchors) {
                    const property = await anchor.getProperty('href')
                    const value = await property?.jsonValue() as string
                    const link = value?.trim();
                    links.push(link)
                }
                
                this.logger.debug(`Found ${links.length} results for ${word} at ${newsOutlet} ...`);
                
                for (const link of links) {
                    await page.goto(link);
                    const contentElements = await page.$$(contentSelector);
                    const textPieces = []
                    for (const element of contentElements) {
                        const innerTextProperty = await element.getProperty('innerText');
                        const innerText = await innerTextProperty?.jsonValue() as string;
                        textPieces.push(innerText)
                    }
                    yield {content: textPieces.join('\n'), link}
                }
    
                this.logger.debug(`Finshed fetching ${newsOutlet} ...`);
    
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                await page.screenshot({path: '/tmp/screenshot.png'});
            }
            throw error;
        } finally {
            browser.close();   
        }

    }

}