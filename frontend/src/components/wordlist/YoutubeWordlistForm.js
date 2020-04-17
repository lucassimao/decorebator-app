import { Container, Fab, makeStyles, NativeSelect } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR, SET_SUCCESS_SNACKBAR } from "../../reducers/snackbar";
import wordlistService from "../../services/wordlist.service";
import youtubeService from "../../services/youtube.service";

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

const MenuLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/menu" innerRef={ref} {...props} />
));

const URL_REGEXP = new RegExp("^((https|http)://(www.)?)?youtu");
const DEFAULT_MIN_WORD_LENGTH = 3;

const generateRandomColor = () => {
  const colorNames = Object.keys(colors);
  const randomIdx = Math.floor(Math.random() * colorNames.length);
  return colors[colorNames[randomIdx]][500];
};

function YoutubeWordlistForm(props) {
  const classes = useStyles();
  const history = useHistory();
  const urlTextFieldRef = useRef();
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const [availableLanguages, setAvailableLanguages] = useState(null);
  const [url, setUrl] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [minWordLength, setMinWordLength] = useState(DEFAULT_MIN_WORD_LENGTH);
  const [onlyNewWords, setOnlyNewWords] = useState(false);

  const onSubmit = async () => {
    if (availableLanguages && languageCode) {
      return createNewWordlist();
    } else {
      return searchAvailableSubtitles();
    }
  }

  const createNewWordlist = async () => {
    try {

      showProgressModal("Wait ...", "Obtaining video details ...");
      const { title, description } = await youtubeService.getVideoDetails(url);
      
      showProgressModal("Wait ...", "Downloading subtitle ...");
      const { translated: translatedLanguageName, name } = availableLanguages.find(lang => lang.code === languageCode);
      const set = await youtubeService.getWordsFromVideoSubtitle(url, languageCode, name, minWordLength);
      const words = Array.from(set)
        .sort()
        .map(name => ({ name }));

      showProgressModal("Wait ...", "Creating your wordlist ...");
      const wordlist = {
        avatarColor: generateRandomColor(),
        name: title,
        description,
        words,
        language: translatedLanguageName,
        isPrivate: true,
        onlyNewWords
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

  const onSliderChange = (evt, value) => {
    setMinWordLength(value);
  };

  const onLanguageChange = evt => {
    const code = evt.target.value;
    setLanguageCode(code);
  };

  const clearVideoUrl = evt => {
    setLanguageCode('')
    setAvailableLanguages(undefined);
    setUrl('');
    urlTextFieldRef.current.focus();
  };

  const searchAvailableSubtitles = async () => {

    if (URL_REGEXP.test(url)) {
      try {
        showProgressModal("Wait ...", "Searching subtitles ...");
        const languages = await youtubeService.getAvailableSubtitleLanguages(url);
        if (!languages || languages.length === 0) {
          throw new Error("No subtitle found");
        }
        setAvailableLanguages(languages);
        setLanguageCode(languages[0].code);
      } catch (error) {
        console.error(error.message);
        setAvailableLanguages(null);
        onError(String(error.message));
        setLanguageCode("");
      } finally {
        hideProgressModal();
      }
    } else {
      onError('Use a valid Youtube URL');
    }
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
              value={url}
              onChange={(evt) => setUrl(evt.target.value)}
              InputProps={
                url
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
                    )
                  }
                  : null
              }
              inputRef={urlTextFieldRef}
              label="Video url"
              variant="outlined"
            />
          </Grid>

          {availableLanguages && (
            <>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="language-select">Language</InputLabel>
                  <NativeSelect
                    inputProps={{
                      id: "language-select"
                    }}
                    fullWidth
                    value={languageCode}
                    onChange={onLanguageChange}
                  >
                    {[...availableLanguages].map(({ code, translated }) => (
                      <option value={code} key={code}>
                        {translated}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  id="discrete-slider"
                  className={classes.formLabel}
                  gutterBottom
                >
                  Minimum word length
            </Typography>
                <Slider
                  step={1}
                  marks
                  value={minWordLength}
                  valueLabelDisplay="auto"
                  onChange={onSliderChange}
                  min={1}
                  max={10}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  classes={{ label: classes.formLabel }}
                  control={
                    <Switch
                      color="primary"
                      value={onlyNewWords}
                      onChange={(evt)=> setOnlyNewWords(evt.target.checked)}
                    />
                  }
                  label="Only new words"
                />
              </Grid>
            </>
          )}
        </Grid>

        <Fab
          size="large"
          className={classes.mainButton}
          onClick={onSubmit}
          variant="extended"
          color="primary"
        >
          {availableLanguages ? 'Save' : 'Search subtitles'}
        </Fab>
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

export default connect(null, mapDispatchToProps)(YoutubeWordlistForm);
