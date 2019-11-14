import { makeStyles, NativeSelect } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import useForm from "react-hook-form";
import { Link } from "react-router-dom";
import youtubeService from '../../services/youtube.service';
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
  }
}));

const HomeLink = React.forwardRef((props, ref) => <Link to="/" innerRef={ref} {...props} />);
const URL_REGEXP = new RegExp("^https://(www.)?youtube.com/watch/*");
const DEFAULT_MIN_WORD_LENGTH = 3;

function FormYoutube() {

  const classes = useStyles();
  const { register, handleSubmit, errors, setValue, getValues } = useForm({ mode: "onBlur", defaultValues: { minWordLength: DEFAULT_MIN_WORD_LENGTH } });
  const [availableLanguages, setAvailableLanguages] = useState(null);
  const {language} = getValues();


  useEffect(() => {
    register({ name: 'minWordLength' })
    register({name: 'language'})
  }, [register]);

  const onSubmit = async data => {
    console.log(data);
    const words = await youtubeService.getWordsFromVideoSubtitle(data.url, data.language, data.minWordLength);
    // let filteredWords = words.filter(w => w.length >= data.minWordLength).sort();
    console.log(words);
    
  };

  const onSliderChange = (evt, value) => setValue('minWordLength', value);
  const onLanguageChange = (evt) => setValue('language',evt.target.value);


  const onYoutubeVideoUrlBlur = async (event) => {
    const url = event.target.value;

    if (URL_REGEXP.test(url)) {
      const languages = await youtubeService.getAvailableSubtitleLanguages(url);
      setAvailableLanguages(languages);
      setValue("language", languages.keys().next().value);
    }
  }

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
            inputRef={register({
              required: "Url field is required",
              pattern: {
                value: URL_REGEXP,
                message: "Incorrect youtube url"
              }
            })}
            label="Youtube video url"
            variant="outlined"
          />
        </Grid>

        {availableLanguages && <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="language-select">Language</InputLabel>
            <NativeSelect
              inputProps={{
                id: 'language-select',
              }}
              value={language}
              onChange={onLanguageChange}
            >
              { [...availableLanguages].map(([lang, description]) => <option value={lang} key={lang}>{description}</option>)}
            </NativeSelect>
          </FormControl>
        </Grid>}
        <Grid item xs={12}>
          <Typography id="discrete-slider" gutterBottom>
            Minimum word length
          </Typography>
          <Slider
            step={1}
            marks
            defaultValue={DEFAULT_MIN_WORD_LENGTH}
            onChange={onSliderChange}
            min={1}
            max={10}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
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

export default FormYoutube;
