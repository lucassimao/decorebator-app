import { Container, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import React from "react";
import useForm from "react-hook-form";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { SET_ERROR_SNACKBAR, SET_SUCCESS_SNACKBAR } from "../../reducers/snackbar";
import { SHOW_PROGRESS_MODAL, HIDE_PROGRESS_MODAL } from "../../reducers/progressModal";

import service from "../../services/wordlist.service";
import AppBreadcrumb from "../common/AppBreadcrumb";

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
  form: {
    color: theme.palette.grey[500],
    "& label": {
      fontWeight: "bold"
    }
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
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const classes = useStyles();
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm({
    defaultValues: { language: "English" }
  });

  const onSubmit = async data => {
    try {
      showProgressModal("Wait ...","Creating your wordlist")
      const resourceUri = await service.save(data);
      hideProgressModal();
      onSuccess("wordlist created");
      history.push(resourceUri);

    } catch (error) {
      hideProgressModal();
      onError(error.message);
      console.log(error);
    }
  };

  return (
    <Container>

      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
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
              rows={3}
              name="description"
              inputRef={register}
              variant="outlined"
              label="Description"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch  name="isPrivate" inputRef={register} color="primary" />
              }
              label="Private"
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
              <option value="Other">Other</option>
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
  onSuccess: message => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message }),
  showProgressModal: (title,description) => dispatch({type: SHOW_PROGRESS_MODAL, description, title}),
  hideProgressModal: () => dispatch({type: HIDE_PROGRESS_MODAL}),
});

export default connect(
  null,
  mapDispatchToProps
)(WordlistForm);
