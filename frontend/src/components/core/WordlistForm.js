import { Button, makeStyles, MenuItem } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import PropTypes from "proptypes";
import React from "react";
import { Controller, useForm } from "react-hook-form";

// TODO<frontend> this limit should increase for paying users
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const DEFAULT_MIN_WORD_LENGTH = 3;

const LANGUAGES = {
  English: "en",
  French: "fr",
  German: "de",
  Italian: "it",
  Portuguese: "pt",
  Spanish: "es",
};
const useStyles = makeStyles((theme) => ({
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
  inputFile: {
    width: "100%",
  },
  inputFileError: {
    border: "1px solid #f00",
  },
}));


export default function WordlistForm({
  onSubmit,
  allowFileUpload,
  allowMinWordLength,
  allowOnlyNewWords,
  name,
  description
}) {

  const classes = useStyles();
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      minWordLength: allowMinWordLength ? DEFAULT_MIN_WORD_LENGTH : 1,
      onlyNewWords: false,
      oneWordPerLine: false,
      language: 'en',
      name,
      description,
      file: null,
    },
  });

  const transformAndSubmitData = (data, event) => {
    let wordlist = data;
    if (data.file) {
      const description = data.description?.trim()
        ? data.description
        : data.file[0].name;
      wordlist = { ...data, description, file: data.file[0] };
    }
    onSubmit(wordlist);
  };


  return (
    <form
      className={classes.form}
      noValidate
      onSubmit={handleSubmit(transformAndSubmitData)}
    >
      <Grid className={classes.grid} container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextField
              fullWidth
              autoComplete="off"
              autoFocus
              error={Boolean(errors?.name)}
              helperText={errors?.name && "Name is required"}
              label="Name"
              variant="outlined"
              {...field}
            />}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              label="Description"
              {...field}
            />}
          />
        </Grid>

        {allowOnlyNewWords && (
          <Grid item xs={12}>
            <Controller
              name="onlyNewWords"
              control={control}
              render={({ field }) => <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    {...field}
                  />
                }
                label="Only new words"
              />}
            />
          </Grid>
        )}

        {allowMinWordLength && (
          <Grid item xs={12}>
            <Typography>Minimum word length</Typography>
            <Controller
              name="minWordLength"
              control={control}
              render={({ field }) => <Slider
                {...field}
                onChange={(_, value) => field.onChange(value)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <InputLabel htmlFor="language">Language</InputLabel>
          <Controller
            name="language"
            control={control}
            render={({ field }) => <Select
              placeholder="Language"
              fullWidth
              {...field}
            >
              {Object.entries(LANGUAGES).map(([label, value]) => (<MenuItem key={value} value={value}>{label}</MenuItem>))}
            </Select>}
          />
        </Grid>

        {allowFileUpload && (
          <Grid item xs={12}>
            <InputLabel style={{ marginBottom: "15px" }} htmlFor="file">
              File
            </InputLabel>
            <input
              className={clsx(classes.inputFile, {
                [classes.inputFileError]: errors.file,
              })}
              accept=".pdf, .txt, .html, .csv, .rtf, .ppt, .pptx, .epub, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              type="file"
              {...register('file', {
                required: { value: true, message: "File is required" },
                validate: (fileList) =>
                  (fileList.length === 1 &&
                    fileList[0].size <= MAX_FILE_SIZE) ||
                  "File size must be less than 2MB",
              })}
            />
            {errors?.file && (
              <FormHelperText variant="filled" error>
                {errors.file.message}
              </FormHelperText>
            )}
            <Controller
              name="oneWordPerLine"
              control={control}
              render={({ field }) => <FormControlLabel
                style={{ marginTop: "10px" }}
                control={
                  <Switch
                    {...field}
                  />
                }
                label="One word per line"
              />}
            />


          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            size="large"
            className={classes.btnSave}
            type="submit"
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            color="primary"
          >
            Save {Object.keys(errors)}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

WordlistForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  allowFileUpload: PropTypes.bool,
  allowMinWordLength: PropTypes.bool,
  allowOnlyNewWords: PropTypes.bool,
  description: PropTypes.string,
  name: PropTypes.string
};
