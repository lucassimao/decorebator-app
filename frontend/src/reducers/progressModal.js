export const HIDE_PROGRESS_MODAL = "hide progress modal";
export const SHOW_PROGRESS_MODAL = "show progress modal";

export default (state = false, action) => {
  switch (action.type) {
    case SHOW_PROGRESS_MODAL:
      const { title, description } = action;
      return { title, description };
    case HIDE_PROGRESS_MODAL:
      return false;
    default:
      return state;
  }
};
