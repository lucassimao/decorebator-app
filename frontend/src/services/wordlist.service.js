import conf from "../conf";

const DEFAULT_HEADERS = {
  "content-type": "application/json"
};

// TODO remove this when signup and signin become available
if (process.env.NODE_ENV === "development") {
  DEFAULT_HEADERS.authorization = `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`;
}

/**
 *
 * @param {wordlist} The wordlist to be created
 * @returns {Promise} A promise which resolves to the link of the new wordlist
 */
const save = async wordlist => {
  const response = await fetch(conf.api.wordlists, {
    method: "POST",
    body: JSON.stringify(wordlist),
    headers: DEFAULT_HEADERS
  });
  return response.headers.get("Link");
};

/**
 * @returns {Promise} A promise that resolves to a array of wordlists
 */
const fetchUserWordlists = async () => {
  const response = await fetch(conf.api.wordlists, {
    headers: DEFAULT_HEADERS
  });
  const { wordlists } = await response.json();
  return wordlists;
};

/**
 * @returns {Promise} A promise that resolves to a array of public wordlists
 */
const fetchPublicWordlists = async () => {
  const response = await fetch(`${conf.api.wordlists}/public`, {
    headers: DEFAULT_HEADERS
  });
  const { wordlists } = await response.json();
  return wordlists;
};

/**
 *
 * @param {String} id The id of wordlist
 * @returns {Promise} A promise which resolves to the wordlist
 */
const get = async id => {
  const response = await fetch(`${conf.api.wordlists}/${id}`, {
    headers: DEFAULT_HEADERS
  });
  const wordlist = await response.json();
  return wordlist;
};

/**
 *
 * @param {String} wordlistId The id of the wordlist to be added a new word
 * @param {String} name The word
 * @returns {Promise<String>} A promise which resolves to the URI of the new resource
 */
const addWord = async (wordlistId, name) => {
  const response = await fetch(`${conf.api.wordlists}/${wordlistId}/words`, {
    headers: DEFAULT_HEADERS,
    method: "POST",
    body: JSON.stringify({ name })
  });
  return response.headers.get("link");
};

const deleteWord = async (wordlistId, wordId) => {
  const response = await fetch(`${conf.api.wordlists}/${wordlistId}/words/${wordId}`, {
    headers: DEFAULT_HEADERS,
    method: "DELETE"
  });

  return response.ok;
};

const api = { save, fetchUserWordlists, fetchPublicWordlists, get, addWord, deleteWord };

export default api;
