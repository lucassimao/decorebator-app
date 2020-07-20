import { ListItem, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

const useSyles = makeStyles(theme => ({
  icon: {
    padding: theme.spacing(0.5)
  }
}));

const InputHOC = ({ defaultValue, updateWord, wordId }) => {
  const [newName, setNewName] = useState(defaultValue);
  const ref = useRef(defaultValue);

  useEffect(() => {
    return async () => {
      // was necessary to avoid this callback closuring to a stale state
      const newName = ref.current;

      if (newName && newName !== defaultValue) {
        await updateWord(wordId, newName);
      }
    };
    // eslint-disable-next-line
  }, []);

  const handleOnChange = evt => {
    setNewName(evt.target.value);
    ref.current = evt.target.value;
  };

  return <InputBase autoComplete="off" onBlur={handleOnChange} onChange={handleOnChange} value={newName} />;
};

const WordlistRow = ({ index, style, deleteWord, updateWord, word }) => {
  const classes = useSyles();
  if (word) {
    return (
      <ListItem style={style}>
        <div>
          <InputHOC updateWord={updateWord} wordId={word.id} defaultValue={word.name} />
          <ListItemSecondaryAction>
            <IconButton onClick={() => deleteWord(word.id)} edge="end" className={classes.icon}>
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

WordlistRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object,
  deleteWord: PropTypes.func.isRequired,
  updateWord: PropTypes.func
};

InputHOC.propTypes = {
  defaultValue: PropTypes.string, updateWord: PropTypes.func, wordId: PropTypes.number
};

export default WordlistRow;
