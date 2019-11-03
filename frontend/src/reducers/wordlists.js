export const LOAD_WORDLISTS = 'load wordlists';
export const SET_USER_WORDLISTS = 'set user wordlists';


export default function wordlists(state = { userWordlists: [] }, action) {
    switch (action.type) {
        case SET_USER_WORDLISTS:
            return { ...state, userWordlists: action.wordlists };
        default:
            return state;
    }
} 
