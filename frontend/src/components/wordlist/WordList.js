import { ListItem, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../reducers/progressModal";
import { SET_ERROR_SNACKBAR } from "../../reducers/snackbar";
import service from "../../services/wordlist.service";

const useSyles = makeStyles(theme => ({
  list: {
    backgroundColor: "#fff"
  },
  icon: {
    padding: theme.spacing(0.5)
  }
}));

var words = [];
const isItemLoaded = idx => Boolean(words[idx]);

function WordList({ wordlistId, onError, showProgressModal, hideProgressModal, wordsCount = 0 }) {
  const classes = useSyles();

  const loadMoreItems = async (startIndex, stopIndex) => {
    const quantity = stopIndex + 1 - startIndex;
    const items = await service.getWords(wordlistId, startIndex, quantity);
    words.splice(startIndex, quantity, ...items);
  };

  const deleteWord = async (wordlistId, wordId) => {
    showProgressModal("Wait", "Deleting word ...");
    await service.deleteWord(wordlistId, wordId);
    words = words.map(w => (w && w._id === wordId ? undefined : w));

    hideProgressModal();
  };

  const updateWord = async (wordId, newName) => {
    try {
      // the update is only triggered when the newName is different from the original name
      if (words.find(w => w._id === wordId && w.name !== newName)) {
        await service.updateWord(wordlistId, wordId, newName);
        words = words.map(w => (w._id === wordId ? { _id: wordId, name: newName } : w));
      }
    } catch (error) {
      console.error(error);
      onError(error.message);
    }
  };

  const Row = ({ index, style }) => {
    if (words[index]) {
      const word = words[index];

      return (
        <ListItem style={style}>
          <div>
            <InputBase
              onBlur={evt => updateWord(word._id, evt.target.value)}
              defaultValue={word.name}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => deleteWord(wordlistId, word._id)}
                edge="end"
                className={classes.icon}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </div>
        </ListItem>
      );
    } else {
      return (
        <ListItem key={index} style={style}>
          Loading ...
        </ListItem>
      );
    }
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={wordsCount} loadMoreItems={loadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              className={classes.list}
              itemCount={wordsCount}
              onItemsRendered={onItemsRendered}
              height={height}
              itemSize={45}
              width={width}
              ref={ref}
            >
              {Row}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}

const mapDispatchToProps = dispatch => ({
  showProgressModal: (title, description) => dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL }),
  onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message })
});

export default connect(null, mapDispatchToProps)(WordList);
