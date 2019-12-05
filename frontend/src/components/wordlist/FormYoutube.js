import { makeStyles, NativeSelect } from "@material-ui/core";
import Button from "@material-ui/core/Button";
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
import ClearIcon from "@material-ui/icons/Clear";
import React, { useEffect, useRef, useState } from "react";
import useForm from "react-hook-form";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR, SET_SUCCESS_SNACKBAR } from "../../reducers/snackbar";
import wordlistService from "../../services/wordlist.service";
import youtubeService from "../../services/youtube.service";
import AppBreadcrumb from "../common/AppBreadcrumb";

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 2),
    height: "100%",
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between",
    color: theme.palette.grey[500],
    "& label": {
      fontWeight: "bold"
    }
  },
  gridButtons: {
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
    "& > :first-child": {
      marginRight: theme.spacing(1)
    }
  },
  urlInputEndAdornment: {
    paddingRight: 0
  }
}));

const HomeLink = React.forwardRef((props, ref) => <Link to="/" innerRef={ref} {...props} />);
const URL_REGEXP = new RegExp("^((https|http)://(www.)?)?youtube.com/watch/*");
const DEFAULT_MIN_WORD_LENGTH = 3;

function FormYoutube(props) {
  const classes = useStyles();
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const { register, handleSubmit, errors, setValue, getValues, clearError } = useForm({
    defaultValues: { minWordLength: DEFAULT_MIN_WORD_LENGTH }
  });
  const { language, url } = getValues();
  const history = useHistory();
  const [availableLanguages, setAvailableLanguages] = useState(null);
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
      const { name, translated : language } = availableLanguages.find(lang => lang.code === data.language);
      const set = await youtubeService.getWordsFromVideoSubtitle(
        data.url,
        data.language,
        name,
        data.minWordLength
      );
      const words = Array.from(set).sort().map(name => ({ name }));

      showProgressModal("Wait ...", "Creating your wordlist ...");
      const wordlist = { name : title, description, words, language, isPrivate: data.isPrivate, onlyNewWords: data.onlyNewWords };
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

  const onYoutubeVideoUrlBlur = async event => {
    const url = event.target.value;

    if (URL_REGEXP.test(url)) {
      try {
        showProgressModal("Wait ...", "Searching subtitles ...");
        const languages = await youtubeService.getAvailableSubtitleLanguages(url);
        if (!languages || languages.length === 0){
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
    <form noValidate className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            fullWidth
            autoComplete="off"
            autoFocus
            error={Boolean(errors.url)}
            helperText={errors.url && errors.url.message}
            name="url"
            onBlur={onYoutubeVideoUrlBlur}
            InputProps={
              url
                ? {
                  classes: { adornedEnd: classes.urlInputEndAdornment },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="clear youtube video's url" onClick={clearVideoUrl}>
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
            label="Youtube video url"
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
          <Typography id="discrete-slider" gutterBottom>
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
            control={<Switch color="primary" name="onlyNewWords" inputRef={register} />}
            label="Only new words"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch name="isPrivate" inputRef={register} color="primary" />
            }
            label="Private"
          />
        </Grid>
      </Grid>

      <Grid className={classes.gridButtons} container justify="flex-end">
        <Button component={HomeLink} variant="contained">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Grid>
    </form>
  );
}

const mapDispatchToProps = dispatch => ({
  onSuccess: message => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message }),
  showProgressModal: (title, description) => dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL })
});

export default connect(null, mapDispatchToProps)(FormYoutube);
