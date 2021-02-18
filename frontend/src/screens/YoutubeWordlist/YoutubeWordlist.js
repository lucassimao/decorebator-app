import { Container, Fab, makeStyles } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from "proptypes";
import React, { useReducer, useRef } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  HIDE_PROGRESS_MODAL,
  SHOW_PROGRESS_MODAL,
} from "../../redux/deprecated/progressModal";
import {
  SET_ERROR_SNACKBAR,
  SET_SUCCESS_SNACKBAR,
} from "../../redux/deprecated/snackbar";
import wordlistService from "../../services/wordlist.service";
import youtubeService from "../../services/youtube.service";
import Form from "./components/Form";
import { INITIAL_STATE, reducer } from "./reducer";

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    position: "relative",
  },
  form: {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: theme.spacing(3, 2),
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
  },
  mainButton: {
    marginTop: theme.spacing(5),
  },
  urlInputEndAdornment: {
    paddingRight: 0,
  },
}));

const MenuLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/menu" innerRef={ref} {...props} />
));
MenuLink.displayName = "MenuLink";

const URL_REGEXP = new RegExp("^((https|http)://(www.)?)?youtu");

const generateRandomColor = () => {
  const colorNames = Object.keys(colors);
  const randomIdx = Math.floor(Math.random() * colorNames.length);
  return colors[colorNames[randomIdx]][500];
};

function Screen(props) {
  const classes = useStyles();
  const history = useHistory();
  const urlTextFieldRef = useRef();
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const onSubmit = async () => {
    const { showForm, url } = state;

    if (showForm) {
      return createNewWordlist();
    } else {
      if (URL_REGEXP.test(url)) {
        dispatch({ type: "SHOW_FORM" });
      } else {
        onError("Use a valid Youtube URL");
        clearVideoUrl();
      }
    }
  };

  const createNewWordlist = async () => {
    try {
      const {
        url,
        subtitle: { languageCode, downloadUrl },
        minWordLength,
      } = state;

      showProgressModal("Wait ...", "Obtaining video details ...");
      const { title, description } = await youtubeService.getVideoDetails(url);

      showProgressModal("Wait ...", "Downloading subtitle ...");
      const set = await youtubeService.getWordsFromVideoSubtitle(
        downloadUrl,
        minWordLength
      );
      const words = Array.from(set)
        .sort()
        .map((name) => ({ name }));

      showProgressModal("Wait ...", "Creating your wordlist ...");
      const wordlist = {
        avatarColor: generateRandomColor(),
        name: title,
        description,
        words,
        language: languageCode,
        isPrivate: true,
        minWordLength,
        onlyNewWords: state.onlyNewWords,
      };
      const resourceUri = await wordlistService.save(wordlist);

      hideProgressModal();
      history.push(resourceUri);

      onSuccess("Wordlist created");
    } catch (error) {
      console.log(error);
      hideProgressModal();
      onError(String(error));
    }
  };

  const clearVideoUrl = () => {
    dispatch({ type: "RESET" });
    urlTextFieldRef.current.focus();
  };

  return (
    <Container className={classes.container}>
      <header className={classes.header}>
        <IconButton
          component={MenuLink}
          size="medium"
          color="primary"
          style={{ position: "absolute", top: -6, left: 0, fontWeight: "bold" }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          Youtube wordlist
        </Typography>
      </header>

      <Typography variant="body2" align="center">
        Create a new wordlist from a youtube video subtitle
      </Typography>

      <div className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoComplete="off"
              autoFocus
              name="url"
              value={state.url}
              onChange={(evt) =>
                dispatch({ type: "SET_URL", url: evt.target.value })
              }
              InputProps={
                state.url
                  ? {
                      classes: { adornedEnd: classes.urlInputEndAdornment },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear youtube video's url"
                            onClick={clearVideoUrl}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : null
              }
              inputRef={urlTextFieldRef}
              label="Video url"
              variant="outlined"
            />
          </Grid>

          {state.showForm && <Form url={state.url} dispatch={dispatch} />}
        </Grid>

        <Fab
          size="large"
          className={classes.mainButton}
          onClick={onSubmit}
          variant="extended"
          color="primary"
        >
          {state.showForm ? "Save" : "Search subtitles"}
        </Fab>
      </div>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onSuccess: (message) => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: (message) => dispatch({ type: SET_ERROR_SNACKBAR, message }),
  showProgressModal: (title, description) =>
    dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL }),
});

Screen.propTypes = {
  onError: PropTypes.func,
  showProgressModal: PropTypes.func,
  hideProgressModal: PropTypes.func,
  onSuccess: PropTypes.func,
};

export const YoutubeWordlistScreen = connect(null, mapDispatchToProps)(Screen);
