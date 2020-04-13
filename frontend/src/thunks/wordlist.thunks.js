import service from "../services/wordlist.service";
import { SET_USER_WORDLISTS, SET_PUBLIC_WORDLISTS } from "../reducers/wordlists";

export function fetchUserWordlists({ page = 0, filter = undefined } = {}) {
  return async dispatch => {
    const wordlists = await service.fetchUserWordlists(filter);
    dispatch({ type: SET_USER_WORDLISTS, wordlists, page });
    return wordlists;
  };
}

export function fetchPublicWordlists({ page = 0, filter = undefined } = {}) {
  return async dispatch => {
    const wordlists = await service.fetchPublicWordlists(filter);
    dispatch({ type: SET_PUBLIC_WORDLISTS, wordlists, page });
    return wordlists;
  };
}