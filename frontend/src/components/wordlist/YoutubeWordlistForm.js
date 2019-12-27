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
import React, { useEffect, useRef, useState } from "react";
import useForm from "react-hook-form";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  HIDE_PROGRESS_MODAL,
  SHOW_PROGRESS_MODAL
} from "../../reducers/progressModal";
import {
  SET_ERROR_SNACKBAR,
  SET_SUCCESS_SNACKBAR
} from "../../reducers/snackbar";
import wordlistService from "../../services/wordlist.service";
import youtubeService from "../../services/youtube.service";

const useStyles = makeStyles(theme => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  header: {
    position: "relative"
  },
  form: {
    marginTop: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: theme.spacing(3, 2),
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column"
  },
  btnSave: {
    marginTop: theme.spacing(5)
  },
  urlInputEndAdornment: {
    paddingRight: 0
  }
}));

const MenuLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/menu" innerRef={ref} {...props} />
));

const URL_REGEXP = new RegExp("^((https|http)://(www.)?)?youtube.com/watch/*");
const DEFAULT_MIN_WORD_LENGTH = 3;

const generateRandomColor = () => {
  const colorNames = Object.keys(colors);
  const randomIdx = Math.floor(Math.random() * colorNames.length);
  return colors[colorNames[randomIdx]][500];
};

function YoutubeWordlistForm(props) {
  const classes = useStyles();
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    getValues,
    clearError
  } = useForm({
    defaultValues: { minWordLength: DEFAULT_MIN_WORD_LENGTH }
  });
  const { language, url } = getValues();
  const [availableLanguages, setAvailableLanguages] = useState(null);
  const history = useHistory();
  const urlTextFieldRef = useRef();

  useEffect(() => {
    register({ name: "minWordLength" });
    register({ name: "language" });
  }, [register]);

  const onSubmit = async data => {
    try {
      showProgressModal("Wait ...", "Obtaining video details ...");
      const { title, description } = await youtubeService.getVideoDetails(
        data.url
      );

      showProgressModal("Wait ...", "Downloading subtitle ...");
      const { name, translated: language } = availableLanguages.find(
        lang => lang.code === data.language
      );
      const set = await youtubeService.getWordsFromVideoSubtitle(
        data.url,
        data.language,
        name,
        data.minWordLength
      );
      const words = Array.from(set)
        .sort()
        .map(name => ({ name }));

      showProgressModal("Wait ...", "Creating your wordlist ...");
      const wordlist = {
        avatarColor: generateRandomColor(),
        name: title,
        description,
        words,
        language,
        isPrivate: true,
        onlyNewWords: data.onlyNewWords
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
    setValue("minWordLength", value);
  };

  const onLanguageChange = evt => {
    const code = evt.target.value;
    setValue("language", code);
  };

  const clearVideoUrl = evt => {
    setValue("language", undefined);
    setAvailableLanguages(undefined);
    setValue("url", "");
    clearError("url");
    urlTextFieldRef.current.focus();
  };

  const findAvailableSubtitles = async event => {
    const url = event.target.value;

    if (URL_REGEXP.test(url)) {
      try {
        showProgressModal("Wait ...", "Searching subtitles ...");
        const languages = await youtubeService.getAvailableSubtitleLanguages(
          url
        );
        if (!languages || languages.length === 0) {
          throw new Error("There's no subtitle for this video");
        }

        setAvailableLanguages(languages);
        if (languages.length > 0) {
          setValue("language", languages[0].code);
        }
      } catch (error) {
        console.error(error);
        setAvailableLanguages(null);
        onError(String(error));
        setValue("language", undefined);
      } finally {
        hideProgressModal();
      }
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

      <form
        noValidate
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              fullWidth
              autoComplete="off"
              autoFocus
              error={Boolean(errors.url)}
              helperText={errors.url && errors.url.message}
              name="url"
              onBlur={findAvailableSubtitles}
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
              inputRef={e => {
                register(e, {
                  required: "Video url is required",
                  pattern: {
                    value: URL_REGEXP,
                    message: "Pattern: https://youtube.com/watch?v=..."
                  }
                });
                urlTextFieldRef.current = e;
              }}
              label="Video url"
              variant="outlined"
            />
          </Grid>

          {availableLanguages && (
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="language-select">Language</InputLabel>
                <NativeSelect
                  inputProps={{
                    id: "language-select"
                  }}
                  fullWidth
                  defaultValue={language}
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
          )}
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
              defaultValue={DEFAULT_MIN_WORD_LENGTH}
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
                  name="onlyNewWords"
                  inputRef={register}
                />
              }
              label="Only new words"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <FormControlLabel
              classes={{ label: classes.formLabel }}
              control={<Switch name="isPrivate" inputRef={register} color="primary" />}
              label="Private"
            />
          </Grid> */}
        </Grid>

        <Fab
          size="large"
          className={classes.btnSave}
          type="submit"
          variant="extended"
          color="primary"
        >
          Save
        </Fab>
      </form>
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
