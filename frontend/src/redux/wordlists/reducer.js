import produce from "immer";
import { SET_USER_WORDLISTS,START_FETCH_USER_WORDLISTS, END_FETCH_USER_WORDLISTS } from "./types";

const INITIAL_STATE = {
  userWordlists: [],
  userWordlistsPage: 0,
  publicWordlists: [],
  publicWordlistsPage: 0,
  isFetchingUserWordlists: false
};

export default function wordlists(state = INITIAL_STATE, action) {
    return produce(state,draftState => {

        if (action.type === SET_USER_WORDLISTS){
            const {wordlists,page} = action.payload;
            draftState.userWordlists = wordlists;
            draftState.userWordlistsPage = page;
        }

        if (action.type === START_FETCH_USER_WORDLISTS) {
            draftState.isFetchingUserWordlists = true
        }

        if (action.type === END_FETCH_USER_WORDLISTS) {
            draftState.isFetchingUserWordlists = false
        }
    })

}
