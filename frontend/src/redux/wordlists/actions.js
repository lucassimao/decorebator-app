import service from "../../services/wordlist.service";
import {
  SET_USER_WORDLISTS,
  START_FETCH_USER_WORDLISTS,
  END_FETCH_USER_WORDLISTS,
} from "./types";

export function fetchUserWordlists({ page = 0, filter } = {}) {
  return async (dispatch) => {
    dispatch({ type: START_FETCH_USER_WORDLISTS });
    try {
      const wordlists = await service.fetchUserWordlists(filter);
      dispatch({
        type: SET_USER_WORDLISTS,
        payload: { wordlists, page, filter },
      });
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: END_FETCH_USER_WORDLISTS });
  };
}
