import { Grid, List, ListItem, makeStyles, TextField, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR } from "../../reducers/snackbar";
import service from "../../services/wordlist.service";
import AppBreadcrumb from "../common/AppBreadcrumb";
import InputBase from "@material-ui/core/InputBase";
import clsx from "clsx";
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';

const useSyles = makeStyles(theme => ({
  grid: {
    height: "100%",
    maxHeight: "100%",
    padding: theme.spacing(0, 2, 1, 2)
  },
  icon: {
    padding: theme.spacing(0.5)
  },
  gridItem: {
    flexBasis: "auto",
    marginTop: theme.spacing(.5),
    "&:first-of-type": {
      margin: 0
    }
  },
  list: {
    backgroundColor: "#fff"
  },
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing(1),
  },
  description: {
    display: 'box',
    boxOrient: 'vertical',
    lineClamp: 3,
    overflow: 'hidden',
    textAlign: 'justify',
    textIndent: theme.spacing(4),

    [theme.breakpoints.up('sm')]: {
      lineClamp: 5,
    }

  },
  selectedWord: {
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.primary.main
  }
}));

function Edit(props) {
  const { showProgressModal, hideProgressModal, onError } = props;
  const { id } = useParams();
  const history = useHistory();
  const classes = useSyles();
  const [focusedWord, setFocusedWord] = useState(null);
  const [wordlist, setWordlist] = useState(null);
  const [words, setWords] = useState([]);

  // eslint-disable-next-line
  useEffect(() => { getWordlistById(id) }, []);

  async function getWordlistById(wordlistId) {
    try {

      showProgressModal("Loading ...");

      const wordlist = await service.get(id);
      console.log(wordlist);

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
      setWordlist({ ...wordlist, words: [...wordlist.words, { name: word, _id }] })
      hideProgressModal();
    }
  };

  const updateWord = async (wordId, name) => {

    if (name !== focusedWord.name) {
      try {
        await service.updateWord(wordlist._id, wordId, name);
        setWords(words.map(w => w._id === wordId ? { _id: wordId, name } : w));
      } catch (error) {
        onError(error.message);
      }
    }

  };

  const deleteWord = async id => {
    showProgressModal("Wait", "Deleting word ...");
    await service.deleteWord(wordlist._id, id);

    setWords(words.filter(w => w._id !== id));
    setFocusedWord(null);
    hideProgressModal();
  };

  const deleteWordlist = async () => {
    showProgressModal("Wait", "Deleting wordlist ...");
    await service.deleteWordlist(wordlist._id);
    hideProgressModal();
    history.push("/");
  };

  const loadMoreItems = async (startIndex, stopIndex) => {
    console.log('loading for ', startIndex, ' to ', stopIndex);
    const words = await service.getWords(wordlist._id, startIndex, stopIndex - startIndex);
    return words;
    /* {words.map(word => (
  
       ))} */
  }

  const renderListItems = ({ index, style }) => {
    if (words[index]) {

      const word = words[index];

      return (
        <ListItem key={word._id}>
          <InputBase
            onFocus={() => setFocusedWord({ _id: word._id, name: word.name })}
            onBlur={evt => updateWord(word._id, evt.target.value)}
            defaultValue={word.name}
            className={clsx({
              [classes.selectedWord]: focusedWord && word._id === focusedWord._id
            })}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={() => deleteWord(word._id)} edge="end" className={classes.icon}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    } else {
      return <ListItem>Carregando item {index} ...</ListItem>
    }
  }

  return (
    wordlist && (
      <Grid wrap="nowrap" direction="column" className={classes.grid} container>
        <Grid className={classes.gridItem} item xs={12}>
          <AppBreadcrumb />
        </Grid>
        <Grid className={`${classes.gridItem} ${classes.title}`} item xs={12}>
          <Typography variant="h6">{wordlist.name} </Typography>
          <IconButton onClick={deleteWordlist} edge="end">
            <DeleteIcon />
          </IconButton>
        </Grid>
        {wordlist.description && <Grid className={classes.gridItem} item xs={12}>
          <Typography variant="caption" className={classes.description}>{wordlist.description}</Typography>
        </Grid>}
        <Grid className={classes.gridItem} item xs={12}>
          <TextField
            margin="dense"
            fullWidth
            autoComplete="off"
            autoFocus
            onFocus={() => setFocusedWord(null)}
            name="name"
            label="Add a new word or expression ..."
            onKeyDown={onTextFieldKeyDown}
            variant="outlined"
          />
        </Grid>
        <Grid className={classes.gridItem} item xs={12} style={{ overflow: "scroll", flexGrow: 1 }}>

          <InfiniteLoader
            isItemLoaded={()=> true}
            itemCount={1000}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (

              <AutoSizer>

                {({ height, width }) => (
                  <FixedSizeList
                    itemCount={1000}
                    className={classes.list}
                    onItemsRendered={onItemsRendered}
                    height={height}
                    itemSize={35}
                    width={width}
                    // ref={ref}
                  >
                    {renderListItems}
                  </FixedSizeList>
                )}


              </AutoSizer>
            )}
          </InfiniteLoader>

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

export default connect(
  null,
  mapDispatchToProps
)(Edit);
