/**
 *
 * @typedef Language
 * @type {Object}
 * @property {string} code The language code
 * @property {string} name The language name
 * @property {string} translated The language name translated to english
 * @property {string} description The original language name
 * *
 * @param {String} url The youtube video url
 * @returns {Array<Language>} A array of subtitle's languages available for the video
 *
 */
async function getAvailableSubtitleLanguages(url) {
  const videoId = _extractVideoIdFromUrl(url);
  const response = await fetch(`http://video.google.com/timedtext?type=list&v=${videoId}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const xmlString = await response.text();
  const xmlDoc = _getXmlDocumentFromString(xmlString);
  const languages = [];
  const trackElements = xmlDoc.getElementsByTagName("track");

  for (let idx = 0; idx < trackElements.length; ++idx) {
    const track = trackElements.item(idx);
    const code = track.getAttribute("lang_code");
    const name = track.getAttribute("name");
    const translated = track.getAttribute("lang_translated");
    const description = track.getAttribute("lang_original");
    languages.push({ code, description, name, translated });
  }

  return languages;
}

/**
 * Returns a object containning details of the video represented by the URL
 *
 * @typedef VideoDetails
 * @type {Object}
 * @property {string} title The video title
 * @property {string} description The video description
 * @property {string} thumbnails The video thumbnails
 * @property {string} defaultAudioLanguage The video's default audio language
 * @property {string} channelTitle Name of the channel which published the video
 *
 *
 * @param {String} url The youtube video url
 * @returns {VideoDetails} More info and properties here https://developers.google.com/youtube/v3/docs/videos/list
 */
async function getVideoDetails(url) {
  const videoId = _extractVideoIdFromUrl(url);
  const fullUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
  const response = await fetch(fullUrl, { headers: { Accept: "application/json" } });
  const jsonResponse = await response.json();
  const item = jsonResponse.items[0].snippet;
  const { title, description, thumbnails, defaultAudioLanguage, channelTitle } = item;
  return { title, description, thumbnails, defaultAudioLanguage, channelTitle };
}

/**
 *
 * @param {String} url The youtube video url
 * @param {String} languageCode The language code of the subtitle
 * @param {String} languageName The language name of the subtitle
 * @returns {Set<String>} A set of words from the subtitle
 */
async function getWordsFromVideoSubtitle(url, languageCode, languageName, minLength) {
  const videoId = _extractVideoIdFromUrl(url);
  const response = await fetch(
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${languageCode}&fmt=srv3&name=${languageName}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const xmlString = await response.text();
  const xmlDoc = _getXmlDocumentFromString(xmlString);
  const elements = xmlDoc.getElementsByTagName("p");
  const words = new Set();

  for (let i = 0; i < elements.length; ++i) {
    const node = elements.item(i);
    const line = node.textContent;
    if (line && line.trim()) {
      line
        .split(/\s+/) // spliting by white space chars
        .forEach(word => {
          // removing unecessary characters and lowering case
          word = word
            .replace(/[[\](),."?!_]/g, "")
            .toLowerCase()
            .trim();
          const hasOnlyDigits = /\d+$/.test(word);
          const lengthIsOK = word.length >= minLength;

          if (!hasOnlyDigits && lengthIsOK) {
            words.add(word);
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
function _getXmlDocumentFromString(xmlString) {
  let xmlDoc;

  if (window.DOMParser) {
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlString, "text/xml");
  } else {
    xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.loadXML(xmlString);
  }
  return xmlDoc;
}

/**
 * Extracts the 'v' paramater which uniquely identifies the video
 *
 * @param {String} url The youtube video URL
 */
function _extractVideoIdFromUrl(url) {
  const youtubeUrl = new URL(url);
  const videoId = youtubeUrl.searchParams.get("v");
  return videoId;
}

const api = { getWordsFromVideoSubtitle, getAvailableSubtitleLanguages, getVideoDetails };

export default api;
