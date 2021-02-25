import { makeStyles } from "@material-ui/core";
import PropTypes from "proptypes";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import {
  HIDE_PROGRESS_MODAL,
  SHOW_PROGRESS_MODAL,
} from "../../../redux/deprecated/progressModal";
import { SET_ERROR_SNACKBAR } from "../../../redux/deprecated/snackbar";
import service from "../../../services/wordlist.service";
import WordlistRow from "./WordlistRow";

const useSyles = makeStyles((theme) => ({
  list: {
    backgroundColor: "#fff",
  },
}));

function Component({
  wordlistId,
  onError,
  showProgressModal,
  hideProgressModal,
  onWordExcluded,
  wordsCount = 0,
}) {
  const classes = useSyles();
  const fixedSizeListRef = useRef();
  const wordsCountRef = useRef(-1);

  const [words, setWords] = useState([]);
  const isItemLoaded = (idx) => Boolean(words[idx]);

  useEffect(() => {
    if (!fixedSizeListRef.current) return;
    if (wordsCountRef.current === -1) {
      wordsCountRef.current = wordsCount;
      return;
    }

    if (wordsCount > wordsCountRef.current) {
      fixedSizeListRef.current.scrollToItem(wordsCount);
    }
    wordsCountRef.current = wordsCount;

  },[wordsCount])

  const loadMoreItems = async (startIndex, stopIndex) => {
    const quantity = stopIndex - startIndex + 1;
    const items = await service.getWords(wordlistId, startIndex, quantity);
    const wordsArray = [...words];
    for (let index = 0; index < items.length; index++) {
      wordsArray[index+startIndex] = items[index];
    }
    setWords(wordsArray)
  };


  const deleteWord = async (wordId) => {
    showProgressModal("Wait", "Deleting word ...");
    await service.deleteWord(wordlistId, wordId);

    if (fixedSizeListRef.current) {
      setWords(words.filter((w) => w.id !== wordId));
      hideProgressModal();
    }

    if (onWordExcluded) {
      onWordExcluded(wordId);
    }
  };

  const updateWord = async (wordId, newName) => {
    try {
      await service.updateWord(wordlistId, wordId, newName);
      if (fixedSizeListRef.current) {
        setWords((currentWords) =>
          currentWords.map((w) =>
            w.id === wordId ? { id: wordId, name: newName } : w
          )
        );
      }
    } catch (error) {
      console.error(error);
      onError(error.message);
    }
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={wordsCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              className={classes.list}
              itemCount={wordsCount}
              onItemsRendered={onItemsRendered}
              height={height}
              itemData={words}
              itemSize={45}
              width={width}
              ref={list => {
                ref(list); 
                fixedSizeListRef.current = list; 
              }}
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

const mapDispatchToProps = (dispatch) => ({
  showProgressModal: (title, description) =>
    dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
  hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL }),
  onError: (message) => dispatch({ type: SET_ERROR_SNACKBAR, message }),
});

Component.propTypes = {
  onError: PropTypes.func,
  showProgressModal: PropTypes.func,
  hideProgressModal: PropTypes.func,
  onSuccess: PropTypes.func,
  onWordExcluded: PropTypes.func,
  wordsCount: PropTypes.number,
  wordlistId: PropTypes.number,
};

const Wordlist = connect(null, mapDispatchToProps)(Component);
export default Wordlist;
