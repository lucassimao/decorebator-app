import { combineReducers } from 'redux'
import auth from './auth';
import snackbar from './snackbar';
import wordlists from './wordlists';



export default combineReducers({auth,snackbar, wordlists});