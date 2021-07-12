import { Page } from "puppeteer";
import NewsSource, { EnglishNewsSource, FrenchNewsSource, SpanishNewsSource } from "./newsSource";

type MappingItem = {
    url: (word: string) => string;
    searchResultItemSelector: string;
    contentSelector: string;
    setup?: (page: Page) => Promise<void>
}

type FullMapping = {
    [newsOutlet in NewsSource]: MappingItem
};

type LanguageMapping<T extends NewsSource> = {
    [newsOutlet in T]: MappingItem
};

const FrenchMapping: LanguageMapping<FrenchNewsSource> = {
    LE_FIGARO: {
        url: (word: string) =>
            `https://recherche.lefigaro.fr/recherche/${encodeURIComponent(word)}/`,
        searchResultItemSelector: '.fig-profil  .fig-profil-headline a',
        contentSelector: "div.fig-body p.fig-paragraph",
    },
    LE_MONDE: {
        url: (word: string) =>
            `https://www.lemonde.fr/recherche/?search_keywords=${encodeURIComponent(word)}&search_sort=relevance_desc`,
        searchResultItemSelector: '.teaser .teaser__link',
        contentSelector: ".article__paragraph",
    }
}

const EnglishMapping: LanguageMapping<EnglishNewsSource> = {
    HITHER_AND_THITHER: {
        url: (word: string) => `https://hitherandthither.net/?s=${encodeURIComponent(word)}`,
        searchResultItemSelector: ".category-posts-grid li.grid-element a",
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
    NY_MAG: {
        url: (word: string) =>
            `https://nymag.com/search.html?q=${encodeURIComponent(word)}`,
        searchResultItemSelector: '.article a',
        contentSelector: "section.body p",
    },
}


const SpanishMapping: LanguageMapping<SpanishNewsSource> = {
    EL_MUNDO: {
        url: (word: string) =>
            `https://ariadna.elmundo.es/buscador/archivo.html?q=${encodeURIComponent(word)}&b_avanzada=`,
        searchResultItemSelector: 'ul.lista_resultados li h3 a',
        contentSelector: ".news-item p",
        setup: async (page) => {
            await page.goto("https://www.elmundo.es/", { waitUntil: 'domcontentloaded' });
            await page.waitForSelector("#didomi-notice-agree-button");
            await page.$eval("#didomi-notice-agree-button", el => el.click());
        }
    },
    EL_PAIS: {
        url: (word: string) =>
            `https://elpais.com/buscador/?qt=${encodeURIComponent(word)}`,
        searchResultItemSelector: 'div.noticia h2>a',
        contentSelector: "#ctn_article_body p",
        setup: async (page) => {
            await page.goto("https://elpais.com/", { waitUntil: 'domcontentloaded' });
            await page.waitForSelector("#didomi-notice-agree-button");
            await page.$eval("#didomi-notice-agree-button", el => el.click());
        }
    }
}

const fullMapping: FullMapping = {
    ...EnglishMapping,
    ...FrenchMapping,
    ...SpanishMapping
};

export default fullMapping;