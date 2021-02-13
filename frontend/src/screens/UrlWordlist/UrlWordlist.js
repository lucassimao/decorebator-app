import { Container, Fab, makeStyles } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from 'proptypes';
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import isUrl from "validator/es/lib/isURL";
import WordlistForm from "../../components/core/WordlistForm";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../redux/deprecated/progressModal";
import { SET_ERROR_SNACKBAR, SET_SUCCESS_SNACKBAR } from "../../redux/deprecated/snackbar";
import wordlistService from "../../services/wordlist.service";

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  header: {
    position: "relative"
  },
  form: {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: theme.spacing(3, 2),
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column"
  },
  mainButton: {
    marginTop: theme.spacing(5)
  },
  urlInputEndAdornment: {
    paddingRight: 0
  }
}));


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
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')


  const onSubmit = async () => {
    if (showForm) {
      return createNewWordlist();
    } else {

      if (isUrl(url)) {
        setShowForm(true)
      } else {
        onError('Use a valid URL');
        clearVideoUrl()
      }
    }
  }

  const createNewWordlist = async ({ minWordLength, onlyNewWords, name, description, language }) => {

    try {

      showProgressModal("Wait ...", "Creating your wordlist ...");
      const wordlist = {
        avatarColor: generateRandomColor(),
        name,
        description,
        language,
        isPrivate: true,
        minWordLength,
        onlyNewWords,
        url
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
    setUrl('');
    urlTextFieldRef.current.focus();
    setShowForm(false)
  }


  return (
    <Container className={classes.container}>
      <header className={classes.header}>
        <IconButton
          component={Link}
          to="/wordlists/menu"
          size="medium"
          color="primary"
          style={{ position: "absolute", top: -6, left: 0, fontWeight: "bold" }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          URL wordlist
        </Typography>
      </header>

      <Typography variant="body2" align="center">
        Create a new wordlist from an internet page
      </Typography>

      <div className={classes.form}>

        <TextField
          fullWidth
          autoComplete="off"
          autoFocus
          name="url"
          value={url}
          onChange={(evt) => setUrl(evt.target.value)}
          InputProps={
            url
              ? {
                classes: { adornedEnd: classes.urlInputEndAdornment },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear url"
                      onClick={clearVideoUrl}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
              : null
          }
          inputRef={urlTextFieldRef}
          label="Url"
          variant="outlined"
        />

        {showForm && <WordlistForm onSubmit={createNewWordlist} allowMinWordLength allowOnlyNewWords />}

        {!showForm && <Fab
          size="large"
          className={classes.mainButton}
          onClick={onSubmit}
          variant="extended"
          color="primary"
        >
          Get url
        </Fab>}
      </div>
    </Container>
  );
}

const mapDispatchToProps = dispatch => ({
  onSuccess: message => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message }),
  showProgressModal: (title, description) =>
    dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL })
});

Screen.propTypes = {
  onError: PropTypes.func,
  showProgressModal: PropTypes.func,
  hideProgressModal: PropTypes.func,
  onSuccess: PropTypes.func
}

export const UrlWordlistScreen = connect(null, mapDispatchToProps)(Screen);
