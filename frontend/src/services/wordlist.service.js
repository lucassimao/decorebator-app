import conf from "../conf";

const DEFAULT_HEADERS = {
  'content-type': 'application/json'
}

// TODO remove this when signup and signin become available
if (process.env.NODE_ENV === 'development') {
  DEFAULT_HEADERS.authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzI2NDQ5MTYsIm5iZiI6MTU3MjY0NDkxNiwiZXhwIjoxNjA0MTgwOTE2LCJpc3MiOiJodHRwczovL2RlY29yZWJhdG9yLmNvbSIsInVzZXJJZCI6IjVkYmM5NDM3YzI3NDIxMDAxMmM3NjY0ZCIsImNsYWltcyI6eyJyb2xlIjoidXNlciJ9fQ.7F-3nV4bW5aTrUV2qIfoxChzs7wFnti00AgX872EZhc';
}

/**
 *
 * @param {wordlist} The wordlist to be created
 * @return {Promise}
 */
const save = (wordlist) => {
  return fetch(conf.api.wordlists, {
    method: "POST",
    body: JSON.stringify(wordlist),
    headers: DEFAULT_HEADERS
  });
};

/**
 * @return {Promise} A promise that resolves to a array of wordlists
 */
const fetchUserWordlists = async () => {
  const response = await fetch(conf.api.wordlists, { headers: DEFAULT_HEADERS });
  const { wordlists } = await response.json();
  return wordlists;
}

const api = { save, fetchUserWordlists };

export default api;