import { Container, makeStyles } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import GrainIcon from "@material-ui/icons/Grain";
import HomeIcon from "@material-ui/icons/Home";
import React, { useState } from "react";
import useForm from "react-hook-form";
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { SET_SUCCESS_SNACKBAR, SET_ERROR_SNACKBAR } from '../reducers/snackbar';
import service from '../services/wordlist.service';
import ProgressModal from './common/ProgressModal';

const LANGUAGES = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Dutch",
  "Mandarin"
];
LANGUAGES.sort();

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(9)
  },
  breadcrumbs: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1)
  },
  form: {
    color: theme.palette.grey[500],
    "& label": {
      fontWeight: "bold"
    }
  },
  link: {
    display: "flex",
    textDecoration: "none"
  },
  navegableLink: {
    color: "inherit"
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  },
  button: {
    margin: theme.spacing(0, 1)
  },
  gridButtons: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1)
  }
}));

const HomeLink = React.forwardRef((props, ref) => (
  <Link to="/" innerRef={ref} {...props} />
));


function WordlistForm(props) {
  const { onSuccess , onError } = props;
  const classes = useStyles();
  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: { language: "English" }
  });

  const onSubmit = async data => {
    try {
      setShowProgress(true);
      await service.save(data);
      setShowProgress(false);
      onSuccess('wordlist created');
      history.push('/');
      
    } catch (error) {
      setShowProgress(false);
      onError(error.message);
      console.log(error);
    }
  }

  return (
    <Container className={classes.root}>
      {/* progress dialog*/}
      {showProgress && <ProgressModal description='Saving your new wordlist' title="Wait ..." />}

      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumbs
              className={classes.breadcrumbs}
              aria-label="breadcrumb"
            >
              <Link
                to="/"
                className={`${classes.link} ${classes.navegableLink}`}
              >
                <HomeIcon className={classes.icon} /> Home
              </Link>
              <Typography color="textPrimary" className={classes.link}>
                <GrainIcon className={classes.icon} />
                New Wordlist
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              fullWidth
              autoComplete="off"
              autoFocus
              error={Boolean(errors.name)}
              helperText={errors.name && "Name is required"}
              name="name"
              inputRef={register({ required: true })}
              className={classes.textField}
              label="Name"
              variant="outlined"
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              inputRef={register}
              variant="outlined"
              label="Description"
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="language">Language</InputLabel>
            <Select
              name="language"
              placeholder="Language"
              fullWidth
              native
              inputRef={register}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
              <option value="Other">
                Other
              </option>
            </Select>
          </Grid>
        </Grid>
        <Grid className={classes.gridButtons} container justify="flex-end">
          <Button
            component={HomeLink}
            variant="contained"
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Save
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

const mapDispatchToProps = dispatch => ({
  onSuccess: (message) => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: (message) => dispatch({ type: SET_ERROR_SNACKBAR, message })
})

export default connect(null, mapDispatchToProps)(WordlistForm);
