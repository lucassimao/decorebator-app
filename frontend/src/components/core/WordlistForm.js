import { Fab, makeStyles } from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import clsx from 'clsx';
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import PropTypes from 'proptypes';
import React, { useEffect } from "react";
import useForm from "react-hook-form";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

// TODO<frontend> this limit should increase for paying users
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const DEFAULT_MIN_WORD_LENGTH = 3;

const LANGUAGES = {
  English: 'en',
  French: 'fr',
  German: 'de',
  Italian:'it',
  Portuguese: 'pt',
  Spanish: 'es'
}

const LANGUAGE_NAMES = Object.keys(LANGUAGES).sort();

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: theme.spacing(3, 2),
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    display: 'flex',
    flexDirection: 'column',
  },
  btnSave: {
    marginTop: theme.spacing(5)
  },
  inputFile: {
    width: '100%'
  },
  inputFileError: {
    border: '1px solid #f00'
  },
}));


export default function WordlistForm({ onSubmit, allowFileUpload, allowMinWordLength, allowOnlyNewWords }) {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm({ defaultValues: { 
    minWordLength: allowMinWordLength ? DEFAULT_MIN_WORD_LENGTH : 1,
    allowOnlyNewWords: false } });

  const transformAndSubmitData = (data, event) => {

    if (data.file) {
      const description = data.description?.trim() ? data.description : data.file[0].name
      onSubmit({ ...data, description, file: data.file[0] })
    } else onSubmit(data)
  }

  useEffect(() => {
    register({ name: 'minWordLength' })
  }, [register])


  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(transformAndSubmitData)}>
      <Grid className={classes.grid} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            // margin="dense"
            fullWidth
            autoComplete="off"
            autoFocus
            error={Boolean(errors.name)}
            helperText={errors.name && "Name is required"}
            name="name"
            inputRef={register({ required: true })}
            label="Name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={5}
            name="description"
            inputRef={register}
            variant="outlined"
            label="Description"
          />
        </Grid>
        {/* <Grid item xs={12}>
            <FormControlLabel
              control={<Switch name="isPrivate" inputRef={register} color="primary" />}
              label="Private"
            />
          </Grid> */}
        {allowOnlyNewWords && <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                name="onlyNewWords"
                defaultValue={false}
                inputRef={register} />
            }
            label="Only new words"
          />
        </Grid>}

        {allowMinWordLength && <Grid item xs={12}>
          <Typography
            gutterBottom>
            Minimum word length
                </Typography>
          <Slider
            step={1}
            marks
            defaultValue={DEFAULT_MIN_WORD_LENGTH}
            valueLabelDisplay="auto"
            onChange={(evt, value) => setValue("minWordLength", value)}
            ref={register}
            min={1}
            max={10}
          />
        </Grid>}
        <Grid item xs={12}>
          <InputLabel htmlFor="language">Language</InputLabel>
          <Select name="language" placeholder="Language" fullWidth native inputRef={register}>
            {LANGUAGE_NAMES.map(lang => (
              <option key={lang} value={LANGUAGES[lang]}>
                {lang}
              </option>
            ))}
            <option value="Other">Other</option>
          </Select>
        </Grid>

        {allowFileUpload && (<Grid item xs={12}>
          <InputLabel style={{ marginBottom: '10px' }} htmlFor="file">File</InputLabel>
          <input className={clsx(classes.inputFile, { [classes.inputFileError]: errors.file })}
            accept=".pdf, .txt, .html, .csv, .rtf, .ppt, .pptx, .epub, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ref={register({
              required: { value: true, message: 'File is required' },
              validate: (fileList) => (fileList.length === 1 && fileList[0].size <= MAX_FILE_SIZE) || 'File size must be less than 2MB'
            })} name="file" type="file" />
          {errors.file && <FormHelperText variant="filled" error>{errors.file.message}</FormHelperText>}
        </Grid>)}
      </Grid>
      <Fab size="large" className={classes.btnSave} type="submit" variant="extended" color="primary">
        Save
        </Fab>

    </form>
  );
}

WordlistForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  allowFileUpload: PropTypes.bool,
  allowMinWordLength: PropTypes.bool,
  allowOnlyNewWords: PropTypes.bool
}

