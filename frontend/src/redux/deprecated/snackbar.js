export const SET_SUCCESS_SNACKBAR = "set_success_snackbar";
export const SET_ERROR_SNACKBAR = "set_error_snackbar";
export const CLEAR_SNACKBAR = "clear_snackbar";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_SUCCESS_SNACKBAR:
      return { success: true, message: action.message };
    case SET_ERROR_SNACKBAR:
      return { error: true, message: action.message };
    case CLEAR_SNACKBAR:
      return {};
    default:
      return state;
  }
};
