import service from '../services/wordlist.service';
import { SET_USER_WORDLISTS } from '../reducers/wordlists';

export function fetchWordlists() {

    return async (dispatch) => {
        const wordlists = await service.fetchUserWordlists();
        dispatch({ type: SET_USER_WORDLISTS, wordlists })
        return wordlists;
    }

}