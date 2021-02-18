export const INITIAL_STATE = {
  url: "",
  subtitle: null,
  minWordLength: 0,
  onlyNewWords: false,
  showForm: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_URL":
      return { ...state, url: action.url };
    case "SET_SUBTITLE": {
      const {
        subtitle: {
          languageCode,
          languageName,
          isAutomatic: isASR,
          downloadUrl,
        },
      } = action;
      return {
        ...state,
        subtitle: { languageCode, languageName, isASR, downloadUrl },
      };
    }
    case "SET_MIN_WORD_LENGTH":
      return { ...state, minWordLength: action.minWordLength };
    case "SET_ONLY_NEW_WORDS":
      return { ...state, onlyNewWords: action.onlyNewWords };
    case "RESET":
      return { ...INITIAL_STATE };
    case "SHOW_FORM":
      return { ...state, showForm: true };
    case "HIDE_FORM":
      return { ...state, showForm: false };
    default:
      throw new Error("unknow action: " + JSON.stringify(action));
  }
}
