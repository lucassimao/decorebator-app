export const LOAD_WORDLISTS = "load wordlists";
export const SET_USER_WORDLISTS = "set user wordlists";
export const SET_PUBLIC_WORDLISTS = "set public wordlists";

const INITIAL_STATE = {
  userWordlists: [],
  userWordlistsPage: 0,
  publicWordlists: [],
  publicWordlistsPage: 0
};

export default function wordlists(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER_WORDLISTS:
      return {
        ...state,
        userWordlists: action.wordlists,
        userWordlistsPage: action.page
      };
    case SET_PUBLIC_WORDLISTS:
      return {
        ...state,
        publicWordlists: action.wordlists,
        publicWordlistsPage: action.page
      };
    default:
      return state;
  }
}
