import { makeStyles } from "@material-ui/core";
import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../../reducers/progressModal";
import { SET_ERROR_SNACKBAR } from "../../../reducers/snackbar";
import service from "../../../services/wordlist.service";
import WordlistRow from "./WordlistRow";

const useSyles = makeStyles(theme => ({
  list: {
    backgroundColor: "#fff"
  }
}));

function Component({
  wordlistId,
  onError,
  showProgressModal,
  hideProgressModal,
  onWordExcluded,
  wordsCount = 0
}) {
  const classes = useSyles();
  const rootElementRef = useRef();
  let [words, setWords] = useState([]);

  const isItemLoaded = idx => Boolean(words[idx]);

  const loadMoreItems = async (startIndex, stopIndex) => {
    const quantity = stopIndex - startIndex + 1;
    const items = await service.getWords(wordlistId, startIndex, quantity);
    words.splice(startIndex, quantity, ...items);

    setWords(Array.from(words));
  };

  const deleteWord = async wordId => {
    showProgressModal("Wait", "Deleting word ...");
    await service.deleteWord(wordlistId, wordId);

    if (rootElementRef.current) {
      setWords(words.filter(w => w._id !== wordId));
      hideProgressModal();
    }

    if (onWordExcluded) {
      onWordExcluded(wordId);
    }
  };

  const updateWord = async (wordId, newName) => {
    try {
      await service.updateWord(wordlistId, wordId, newName);
      if (rootElementRef.current) {
        setWords(currentWords =>
          currentWords.map(w => (w._id === wordId ? { _id: wordId, name: newName } : w))
        );
      }
    } catch (error) {
      console.error(error);
      onError(error.message);
    }
  };

  return (
    <AutoSizer ref={rootElementRef}>
      {({ height, width }) => (
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={wordsCount} loadMoreItems={loadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              className={classes.list}
              itemCount={wordsCount}
              onItemsRendered={onItemsRendered}
              height={height}
              itemData={words}
              itemSize={45}
              width={width}
              ref={ref}
            >
              {({ index, style }) => (
                <WordlistRow
                  index={index}
                  style={style}
                  word={words[index]}
                  updateWord={updateWord}
                  deleteWord={deleteWord}
                />
              )}
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

const Wordlist = connect(null, mapDispatchToProps)(Component);
export default Wordlist;
