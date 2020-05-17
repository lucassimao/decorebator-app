import { Fab, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import PropTypes from 'proptypes';
import React from "react";
import useForm from "react-hook-form";

const LANGUAGES = ["Dutch", "English", "French", "German", "Italian", "Portuguese", "Mandarin", "Spanish",];
LANGUAGES.sort();

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
  }
}));


export default function WordlistForm({onSubmit}) {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();


  return (
      <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
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
          <Grid item xs={12}>
            <InputLabel htmlFor="language">Language</InputLabel>
            <Select name="language" placeholder="Language" fullWidth native inputRef={register}>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
              <option value="Other">Other</option>
            </Select>
          </Grid>
        </Grid>
        <Fab size="large" className={classes.btnSave} type="submit" variant="extended" color="primary">
          Save
            </Fab>

      </form>
  );
}

WordlistForm.propTypes = {
  onSubmit: PropTypes.func
}

