import { combineReducers } from "redux";
import auth from "./auth";
import snackbar from "./snackbar";
import wordlists from "./wordlists";
import progressModal from "./progressModal";

export default combineReducers({ auth, snackbar, wordlists, progressModal });
