import { combineReducers } from "redux";
import auth from "./deprecated/auth";
import snackbar from "./deprecated/snackbar";
import progressModal from "./deprecated/progressModal";
import wordlists from "./wordlists/reducer";

export const rootReducer = combineReducers({
  auth,
  snackbar,
  wordlists,
  progressModal,
});
