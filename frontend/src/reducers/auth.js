export const SET_LOGGED_IN = 'set logged in';

export default (state = {}, action) => {
    switch(action.type){
        case SET_LOGGED_IN:
            break;
        default:
            return state;
    }
}