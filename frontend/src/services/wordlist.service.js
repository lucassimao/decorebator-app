import conf from "../conf";

const DEFAULT_HEADERS = {
  "content-type": "application/json"
};

// TODO remove this when signup and signin become available
if (process.env.NODE_ENV === "development") {
  DEFAULT_HEADERS.authorization =
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzI2NDQ5MTYsIm5iZiI6MTU3MjY0NDkxNiwiZXhwIjoxNjA0MTgwOTE2LCJpc3MiOiJodHRwczovL2RlY29yZWJhdG9yLmNvbSIsInVzZXJJZCI6IjVkYmM5NDM3YzI3NDIxMDAxMmM3NjY0ZCIsImNsYWltcyI6eyJyb2xlIjoidXNlciJ9fQ.7F-3nV4bW5aTrUV2qIfoxChzs7wFnti00AgX872EZhc";
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

const api = { save, fetchUserWordlists, get };

export default api;
