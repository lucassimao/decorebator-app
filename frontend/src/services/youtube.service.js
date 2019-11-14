

/**
 * 
 * @param {String} url The youtube video url
 * @returns {Map<String,String>} A map from language codes to language description
 */
async function getAvailableSubtitleLanguages(url) {
    const youtubeUrl = new URL(url);
    const videoId = youtubeUrl.searchParams.get("v");
    const response = await fetch(`http://video.google.com/timedtext?type=list&v=${videoId}`);
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const xmlString = await response.text();
    const xmlDoc = getXmlDocumentFromString(xmlString);
    const languages = new Map();
    const trackElements = xmlDoc.getElementsByTagName('track');

    for (let idx = 0; idx < trackElements.length; ++idx) {
        const track = trackElements.item(idx);
        const langCode = track.getAttribute("lang_code");
        const description = track.getAttribute("lang_original");
        languages.set(langCode, description);
    }

    return languages;
}

/**
 * 
 * @param {String} url The youtube video url
 * @param {String} language The language code of the subtitles
 * @returns {Set<String>} A set of words from the subtitle
 */
async function getWordsFromVideoSubtitle(url, language, minLength) {
    const youtubeUrl = new URL(url);
    const videoId = youtubeUrl.searchParams.get("v");
    const response = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=${language}&fmt=srv3`);
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const xmlString = await response.text();
    const xmlDoc = getXmlDocumentFromString(xmlString);
    const elements = xmlDoc.getElementsByTagName("p");
    const words = new Set();

    for (let i = 0; i < elements.length; ++i) {
        const node = elements.item(i);
        const line = node.textContent;
        if (line && line.trim()) {
            line.split(/\s+/) // spliting by white space chars
                .map(w => w.replace(/\W/g, "").toLowerCase() ) // removing non alphanumeric chars and lowering case 
                .forEach(w => {
                    if (w.length >= minLength) {
                        words.add(w);
                    }
                });
        }
    }
    return words;
}

/**
 * 
 * @param {String} xmlString The xml document as a pure string
 * @returns {XMLDocument} The object representing a hierarchy of nodes
 */
function getXmlDocumentFromString(xmlString) {
    let xmlDoc;

    if (window.DOMParser) {
        const parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlString, "text/xml")
    } else {
        xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlString)
    }
    return xmlDoc;
}


const api = { getWordsFromVideoSubtitle, getAvailableSubtitleLanguages }

export default api;