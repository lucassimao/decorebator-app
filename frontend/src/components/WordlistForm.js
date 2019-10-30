import { makeStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import React, { useState } from "react";
import useForm from "react-hook-form";

const LANGUAGES = ["English", "Spanish", "Portuguese", 
                    "French", "German", "Italian", "Dutch", "Mandarin"];
LANGUAGES.sort();

const useStyles = makeStyles(theme => ({
  form: {
    color: theme.palette.grey[500],
    "& label": {
      fontWeight: "bold"
    }
  }
}));

function WordlistForm(props) {
  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const [language, setLanguage] = useState("Other");
  const classes = useStyles();
  const onSubmit = data => console.log(data);

  const handleLanguageSelect = (event) => {
    setLanguage(event.target.value);
    setValue("language", event.target.value);
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            fullWidth
            autoFocus
            className={classes.textField}
            label="Name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Switch checked color="primary" />} label="Private" />
        </Grid>
        <Grid item xs={12}>
          <TextField multiline rows={3} variant="outlined" label="Description" />
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="language">Language</InputLabel>
          <Select
            name="language"
            placeholder="Language"
            value={language}
            onChange={handleLanguageSelect}
            fullWidth
            inputRef={register()}
          >
            {LANGUAGES.map(lang => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
            <MenuItem value="Other">
              <em>Other</em>
            </MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* <FormControl variant="outlined" className={classes.formControl}> */}

      {/* </FormControl> */}
    </form>
  );
}

export default WordlistForm;
