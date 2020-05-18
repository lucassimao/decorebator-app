import { Container, IconButton, makeStyles } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PropTypes from 'proptypes';
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import WordlistForm from '../../components/core/WordlistForm';
import MenuLink from '../../components/ui/MenuLink';
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR, SET_SUCCESS_SNACKBAR } from "../../reducers/snackbar";
import service from "../../services/wordlist.service";


const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
  },
  container: {
    maxHeight: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
}));

const generateRandomColor = () => {
  const colorNames = Object.keys(colors);
  const randomIdx = Math.floor(Math.random() * colorNames.length);
  return colors[colorNames[randomIdx]][500];
};



function Screen(props) {
  const { onSuccess, onError, showProgressModal, hideProgressModal } = props;
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = data => {
    showProgressModal("Wait ...", "Creating your wordlist");

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      try {
        const base64EncodedFile = reader.result
        const wordlist = { ...data, avatarColor: generateRandomColor(), base64EncodedFile }
        const resourceUri = await service.save(wordlist);

        hideProgressModal();
        onSuccess("wordlist created");
        history.push(resourceUri);
      } catch (error) {
        onError(error.message);
        console.log(error);
      } finally {
        hideProgressModal();
      }

    }, false);

    reader.readAsDataURL(data.file)


  };

  return (
    <Container className={classes.container}>

      <header className={classes.header}>

        <IconButton component={MenuLink} size="medium" color="primary"
          style={{ position: "absolute", top: -6, left: 0, fontWeight: "bold" }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          New wordlist
        </Typography>
      </header>


      <Typography variant="body2" align="center">
        Create a new wordlist from a file
        </Typography>

      <WordlistForm onSubmit={onSubmit} allowFileUpload />
    </Container>

  );
}

const mapDispatchToProps = dispatch => ({
  onSuccess: message => dispatch({ type: SET_SUCCESS_SNACKBAR, message }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message }),
  showProgressModal: (title, description) => dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL })
});

Screen.propTypes = {
  onError: PropTypes.func,
  showProgressModal: PropTypes.func,
  hideProgressModal: PropTypes.func,
  onSuccess: PropTypes.func
}

export const FileWordlistScreen = connect(null, mapDispatchToProps)(Screen);
