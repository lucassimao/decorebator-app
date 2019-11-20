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
  if (!response.ok) {
    throw new Error("Couldn't create wordlist: " + response.statusText)
  }
  return response.headers.get("Link");
};

/**
 * @returns {Promise} A promise that resolves to a array of wordlists
 */
const fetchUserWordlists = async (filter = undefined) => {
  let url = conf.api.wordlists;
  if (filter) {
    url += `?filter=${filter}`;
  }
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS
  });
  const { wordlists } = await response.json();
  return wordlists;
};

/**
 * @returns {Promise} A promise that resolves to a array of public wordlists
 */
const fetchPublicWordlists = async (filter = undefined) => {
  let url = `${conf.api.wordlists}/public`;
  if (filter) {
    url += `?filter=${filter}`;
  }
  const response = await fetch(url, {
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

const updateWord = async (wordlistId, wordId, name) => {
  const response = await fetch(`${conf.api.wordlists}/${wordlistId}/words/${wordId}`, {
    headers: DEFAULT_HEADERS,
    method: "PATCH",
    body: JSON.stringify({ name })
  });

  return response.ok;
};

/**
 *
 * @param {String} wordlistId Id of the wordlist to be excluded
 */
const deleteWordlist = async wordlistId => {
  const response = await fetch(`${conf.api.wordlists}/${wordlistId}`, {
    headers: DEFAULT_HEADERS,
    method: "DELETE"
  });

  return response.ok;
};

const getWords = async (wordlistId, startIdx, pageSize) => {
  const response = await fetch(`${conf.api.wordlists}/${wordlistId}/words?page=${startIdx}&pageSize=${pageSize}`, {
    headers: DEFAULT_HEADERS
  });

  const words = await response.json();
  return words;
}

const api = {
  save,
  fetchUserWordlists,
  fetchPublicWordlists,
  get,
  addWord,
  deleteWord,
  deleteWordlist,
  updateWord,
  getWords
};

export default api;
