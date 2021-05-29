import { Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "proptypes";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import AppBreadcrumb from "../../components/ui/AppBreadcrumb";
import {
  HIDE_PROGRESS_MODAL,
  SHOW_PROGRESS_MODAL,
} from "../../redux/deprecated/progressModal";
import { SET_ERROR_SNACKBAR } from "../../redux/deprecated/snackbar";
import service from "../../services/wordlist.service";
import Wordlist from "./components/Wordlist";
import { Container } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";

const useSyles = makeStyles((theme) => ({
  grid: {
    height: "100%",
    maxHeight: "100%",
    padding: theme.spacing(0, 2, 1, 2),
  },

  gridItem: {
    flexBasis: "auto",
    marginTop: theme.spacing(0.5),
    "&:first-of-type": {
      margin: 0,
    },
  },
  titleIcon: {
    position: "relative",
    bottom: theme.spacing(-0.5),
    marginRight: theme.spacing(1),
  },
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing(1),
  },
  description: {
    display: "box",
    boxOrient: "vertical",
    lineClamp: 3,
    overflow: "hidden",
    textAlign: "justify",
    textIndent: theme.spacing(4),

    [theme.breakpoints.up("sm")]: {
      lineClamp: 5,
    },
  },
  header: {
    position: "relative",
  },
}));

function Screen(props) {
  const { showProgressModal, hideProgressModal, onError } = props;
  const { id } = useParams();
  const history = useHistory();
  const classes = useSyles();
  const [wordlist, setWordlist] = useState(null);
  const [wordsCount, setWordsCount] = useState(0);

  useEffect(() => {
    getWordlistById(id);
    // eslint-disable-next-line
  }, []);

  async function getWordlistById(wordlistId) {
    try {
      showProgressModal("Loading ...");

      const wordlist = await service.get(wordlistId);
      setWordlist(wordlist);
      setWordsCount(parseInt(wordlist.wordsCount));
    } catch (error) {
      onError(error.message);
      console.error(error);
    } finally {
      hideProgressModal();
    }
  }

  const onTextFieldKeyDown = async (event) => {
    if (event.keyCode === 13) {
      const word = event.target.value;
      const itsEmpty = word && !word.trim();
      if (itsEmpty) {
        return;
      }

      event.preventDefault();

      showProgressModal("Wait", "Adding new word ...");
      event.target.value = "";
      await service.addWord(id, word);

      setWordsCount((current) => current + 1);
      hideProgressModal();
    }
  };

  const deleteWordlist = async () => {
    showProgressModal("Wait", "Deleting wordlist ...");
    await service.deleteWordlist(wordlist.id);
    hideProgressModal();
    history.push("/");
  };

  const onWordExcludedListener = () => {
    setWordsCount((current) => current - 1);
  };

  if (!wordlist) return null;

  return (
    <Container style={{ height: "95vh", padding: 0, margin: '0 auto' }}>
      <Grid wrap="nowrap" direction="column" className={classes.grid} container>

        <Grid className={classes.gridItem} item xs={12}>
          <header className={classes.header}>
            <IconButton
              component={Link}
              to="/"
              size="medium"
              color="primary"
              style={{ position: "absolute", top: -5, left: 0, fontWeight: "bold" }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" style={{ fontWeight: "bold", }} align="center">
              Edit wordlist
            </Typography>

            <IconButton onClick={deleteWordlist} style={{ position: "absolute", top: -5, right: 0, fontWeight: "bold" }}>
              <DeleteIcon />
            </IconButton>
          </header>
        </Grid>

        <Grid className={classes.gridItem} item xs={12}>
          <Typography variant="caption">
            {wordsCount} {wordlist.language.toLowerCase()} word(s) in  {wordlist.name}
          </Typography>
        </Grid>
        {wordlist.description && (
          <Grid className={classes.gridItem} item xs={12}>
            <Typography variant="caption" className={classes.description}>
              {wordlist.description}
            </Typography>
          </Grid>
        )}
        <Grid className={classes.gridItem} item xs={12}>
          <TextField
            margin="dense"
            fullWidth
            autoComplete="off"
            autoFocus
            name="name"
            label="Add a new word or expression ..."
            onKeyDown={onTextFieldKeyDown}
            variant="outlined"
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} style={{ flexGrow: 1 }}>
          <Wordlist
            onWordExcluded={onWordExcludedListener}
            wordsCount={wordsCount}
            wordlistId={wordlist.id}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  showProgressModal: (title, description) =>
    dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL }),
  onError: (message) => dispatch({ type: SET_ERROR_SNACKBAR, message }),
});

Screen.propTypes = {
  onError: PropTypes.func,
  showProgressModal: PropTypes.func,
  hideProgressModal: PropTypes.func,
};

export const EditWordlistScreen = connect(null, mapDispatchToProps)(Screen);
