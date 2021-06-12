import NewsSource, { GermanNewsSource, FrenchNewsSource, EnglishNewsSource, ItalianNewsSource, PortugueseNewsSource, SpanishNewsSource } from "./newsSource";

type MappingItem = {
    url: (word: string) => string;
    searchResultItemSelector: string;
    contentSelector: string;
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
            `https://www.lemonde.fr/recherche/?search_keywords=${encodeURIComponent(word)}&search_sort=relevance_desc`,
        searchResultItemSelector: '.teaser .teaser__link',
        contentSelector: ".article__paragraph",
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

const GermanMapping: LanguageMapping<GermanNewsSource> = {
    SPIEGEL: {
        url: (word: string) =>
            `https://www.spiegel.de/suche/?suchbegriff=${encodeURIComponent(word)}&seite=1`,
        searchResultItemSelector: 'section[data-search-results] article h2 a',
        contentSelector: "main section div.RichText>p",
    },
    BILD: {
        url: (word: string) =>
            `https://www.bild.de/suche.bild.html?query=${encodeURIComponent(word)}`,
        searchResultItemSelector: 'section ol li div>a',
        contentSelector: "main article div.txt p",
    },
    ZEIT: {
        url: (word: string) =>
            `https://www.zeit.de/suche/index?q=${encodeURIComponent(word)}`,
        searchResultItemSelector: 'section article a.zon-teaser-standard__combined-link',
        contentSelector: ".paragraph.article__item",
    }
}

const ItalianMapping: LanguageMapping<ItalianNewsSource> = {
    CORRIERE_DELLA_SERA: {
        url: (word: string) =>
            `https://sitesearch.corriere.it/forward.jsp?q=${encodeURIComponent(word)}#`,
        searchResultItemSelector: 'div.search-page h1>a',
        contentSelector: "p.chapter-paragraph",
    },
    LA_REPUBLICA: {
        url: (word: string) =>
            `https://ricerca.repubblica.it/ricerca/repubblica?query=${encodeURIComponent(word)}&view=repubblica&ref=HRHS`,
        searchResultItemSelector: 'article h1>a',
        contentSelector: ".story__text p",
    }
}

const PortugueseMapping: LanguageMapping<PortugueseNewsSource> = {
    ESTADAO: {
        url: (word: string) =>
            `https://busca.estadao.com.br/?q=${encodeURIComponent(word)}`,
        searchResultItemSelector: 'a.link-title',
        contentSelector: "div.content p",
    },
    FOLHA_DE_SAO_PAULO: {
        url: (word: string) =>
            `https://search.folha.uol.com.br/?q=${encodeURIComponent(word)}&site=todos`,
        searchResultItemSelector: 'ol li div.c-headline__content>a',
        contentSelector: "div.c-news__body p",
    }
}

const SpanishMapping: LanguageMapping<SpanishNewsSource> = {
    EL_MUNDO: {
        url: (word: string) =>
            `https://ariadna.elmundo.es/buscador/archivo.html?q=${encodeURIComponent(word)}&b_avanzada=`,
        searchResultItemSelector: 'ul.lista_resultados li a',
        contentSelector: "div[data-section=articleBody] p",
    },
    EL_PAIS: {
        url: (word: string) =>
            `https://elpais.com/buscador/?qt=${encodeURIComponent(word)}`,
        searchResultItemSelector: 'div.noticia h2>a',
        contentSelector: "div.articulo-cuerpo p",
    }
}

const fullMapping: FullMapping = {
    ...EnglishMapping,
    ...FrenchMapping,
    ...GermanMapping,
    ...ItalianMapping,
    ...PortugueseMapping,
    ...SpanishMapping
};

export default fullMapping;