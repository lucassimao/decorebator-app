import { Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PublicIcon from "@material-ui/icons/Public";
import VpnLockRoundedIcon from "@material-ui/icons/VpnLockRounded";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR } from "../../reducers/snackbar";
import service from "../../services/wordlist.service";
import AppBreadcrumb from "../common/AppBreadcrumb";
import WordList from "./WordList";

const useSyles = makeStyles(theme => ({
  grid: {
    height: "100%",
    maxHeight: "100%",
    padding: theme.spacing(0, 2, 1, 2)
  },

  gridItem: {
    flexBasis: "auto",
    marginTop: theme.spacing(0.5),
    "&:first-of-type": {
      margin: 0
    }
  },
  titleIcon: {
    position: "relative",
    bottom: theme.spacing(-0.5),
    marginRight: theme.spacing(1)
  },
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing(1)
  },
  description: {
    display: "box",
    boxOrient: "vertical",
    lineClamp: 3,
    overflow: "hidden",
    textAlign: "justify",
    textIndent: theme.spacing(4),

    [theme.breakpoints.up("sm")]: {
      lineClamp: 5
    }
  }
}));

function Edit(props) {
  const { showProgressModal, hideProgressModal, onError } = props;
  const { id } = useParams();
  const history = useHistory();
  const classes = useSyles();
  const [wordlist, setWordlist] = useState(null);

  useEffect(() => {
    getWordlistById(id);
    // eslint-disable-next-line
  }, []);

  async function getWordlistById(wordlistId) {
    try {
      showProgressModal("Loading ...");

      const wordlist = await service.get(id);
      setWordlist(wordlist);
    } catch (error) {
      onError(error.message);
      console.error(error);
    } finally {
      hideProgressModal();
    }
  }

  const onTextFieldKeyDown = async event => {
    if (event.keyCode === 13) {
      const word = event.target.value;
      const itsEmpty = word && !word.trim();
      if (itsEmpty) {
        return;
      }

      event.preventDefault();

      showProgressModal("Wait", "Adding new word ...");
      event.target.value = "";
      const uri = await service.addWord(id, word);
      const _id = uri.substr(uri.lastIndexOf("/") + 1);
      // TODO fix
      setWordlist({ ...wordlist, words: [...wordlist.words, { name: word, _id }] });
      hideProgressModal();
    }
  };

  const deleteWordlist = async () => {
    showProgressModal("Wait", "Deleting wordlist ...");
    await service.deleteWordlist(wordlist._id);
    hideProgressModal();
    history.push("/");
  };

  return (
    wordlist && (
      <Grid wrap="nowrap" direction="column" className={classes.grid} container>
        <Grid className={classes.gridItem} item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid className={`${classes.gridItem} ${classes.title}`} item xs={12}>
          <span>

            {wordlist.isPrivate ? (
              <VpnLockRoundedIcon className={classes.titleIcon} />
            ) : (
              <PublicIcon className={classes.titleIcon} />
            )}

            <Typography display="inline" variant="h6">
              {wordlist.name}
            </Typography>
          </span>
          <IconButton onClick={deleteWordlist} edge="end">
            <DeleteIcon />
          </IconButton>
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
          <WordList wordsCount={wordlist.wordsCount} wordlistId={wordlist._id} />
        </Grid>
      </Grid>
    )
  );
}

const mapDispatchToProps = dispatch => ({
  showProgressModal: (title, description) => dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message })
});

export default connect(null, mapDispatchToProps)(Edit);
