import { ListItem, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import React from "react";

const useSyles = makeStyles(theme => ({
  icon: {
    padding: theme.spacing(0.5)
  }
}));

class InputHOC extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { newName: props.defaultValue };
    // console.log("constructor ", props.defaultValue);
  }

  handleOnChange = evt => {
    // console.log("onChange ", evt.target.value);
    this.setState({ newName: evt.target.value });
  };

  componentWillUnmount() {
    (async () => {
    //   console.log("will unmount ", this.state.newName);
      await this.update();
    })();
  }

  update = async () => {
    const newName = this.state.newName;
    const defaultValue = this.props.defaultValue;

    if (newName && newName !== defaultValue) {
    //   console.log("update ", defaultValue, " ", newName);
      await this.props.updateWord(this.props.wordId, newName);
    }
  };

  render() {
    return (
      <InputBase
        autoComplete="off"
        onBlur={this.update}
        onChange={this.handleOnChange}
        value={this.state.newName}
      />
    );
  }
}

const WordlistRow = ({ index, style, deleteWord, updateWord, word }) => {
  const classes = useSyles();
  if (word) {
    return (
      <ListItem style={style}>
        <div>
          <InputHOC updateWord={updateWord} wordId={word._id} defaultValue={word.name} />
          <ListItemSecondaryAction>
            <IconButton onClick={() => deleteWord(word._id)} edge="end" className={classes.icon}>
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

export default WordlistRow;
