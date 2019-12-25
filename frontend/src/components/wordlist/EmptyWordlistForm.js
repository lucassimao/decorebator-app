import { Container, Fab, IconButton, makeStyles } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import useForm from "react-hook-form";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR, SET_SUCCESS_SNACKBAR } from "../../reducers/snackbar";
import service from "../../services/wordlist.service";


const LANGUAGES = ["Dutch", "English", "French", "German", "Italian", "Portuguese", "Mandarin", "Spanish",];
LANGUAGES.sort();

const useStyles = makeStyles(theme => ({

  header: {
    position: 'relative',
    marginBottom: theme.spacing(1)
  },
  container: {
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  form: {
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    "& label": {
      fontWeight: "bold"
    },
    display: 'flex',
    flexDirection: 'column',
  },
  btnSave: {
    marginTop: theme.spacing(5)
  }
}));

const generateRandomColor = () => {
  const colorNames = Object.keys(colors);
  const randomIdx = Math.floor(Math.random() * colorNames.length);
  return colors[colorNames[randomIdx]][500];
};

const MenuLink = React.forwardRef((props, ref) => <Link to="/wordlists/menu" innerRef={ref} {...props} />);

function EmptyWordlistForm(props) {
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const classes = useStyles();
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async data => {

    data.isPrivate = true;

    try {
      showProgressModal("Wait ...", "Creating your wordlist");

      data.avatarColor = generateRandomColor();
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
    <Container className={classes.container}>

      <header className={classes.header}>

        <IconButton component={MenuLink} size="medium" color="primary"
          style={{ position: "absolute", top: -5, left: 0, fontWeight: "bold" }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          New wordlist
        </Typography>
      </header>

      <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid className={classes.grid} container spacing={2}>
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
    </Container>

  );
}

const mapDispatchToProps = dispatch => ({
  onSuccess: message => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message }),
  showProgressModal: (title, description) => dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL })
});

export default connect(null, mapDispatchToProps)(EmptyWordlistForm);
