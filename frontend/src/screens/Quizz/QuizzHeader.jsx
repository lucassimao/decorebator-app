import { FormControlLabel, IconButton, Typography } from "@material-ui/core";
import { Settings, ArrowBack } from "@material-ui/icons";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useStyles } from "./quizz.styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import Proptypes from "prop-types";

const QUIZZ_TYPE_LABEL = {
  SYNONYM: "Synonyms",
  WORD_FROM_MEANING: "Word from meaning",
  MEANING_FROM_WORD: "Meaning from word",
  FILL_SENTENCE: "Fill sentence",
  FILL_NEWS_SENTENCE: "Fill news sentence",
  WORD_FROM_AUDIO: "Word from audio",
};

export const QuizzHeader = ({
  onChangeQuizTypeSelection,
  quizzTypeSelection,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const [selectionChanges, setSelectionChanges] = useState({
    ...quizzTypeSelection,
  });

  const handleChange = (event) => {
    setSelectionChanges({
      ...selectionChanges,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    const notifyChange = Object.keys(selectionChanges).find(
      (type) => selectionChanges[type] !== quizzTypeSelection[type]
    );
    if (notifyChange && onChangeQuizTypeSelection)
      onChangeQuizTypeSelection(selectionChanges);
  };

  return (
    <header className={classes.header}>
      <IconButton
        component={RouterLink}
        to="/"
        size="medium"
        color="primary"
        style={{ position: "absolute", top: -5, left: 0, fontWeight: "bold" }}
      >
        <ArrowBack />
      </IconButton>

      <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
        Quizz
      </Typography>

      <IconButton
        size="medium"
        color="primary"
        onClick={handleClick}
        style={{ position: "absolute", top: -5, right: 0, fontWeight: "bold" }}
      >
        <Settings />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(quizzTypeSelection)
          .sort()
          .map((quizzType) => (
            <MenuItem key={quizzType}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={selectionChanges[quizzType]}
                    onChange={handleChange}
                    name={quizzType}
                  />
                }
                label={QUIZZ_TYPE_LABEL[quizzType]}
              />
            </MenuItem>
          ))}
      </Menu>
    </header>
  );
};

QuizzHeader.propTypes = {
  onChangeQuizTypeSelection: Proptypes.func,
  quizzTypeSelection: Proptypes.object.isRequired,
};
