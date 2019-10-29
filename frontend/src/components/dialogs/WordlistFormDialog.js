import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Link from '@material-ui/core/Link';
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import WordlistForm from '../WordlistForm';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  dialogTitle: {
    border: "1px solid red",
    padding: 0,
    display: "flex",
    justifyContent: "space-between"
  }
});

function WordlistFormDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    if (onClose) {
      onClose(selectedValue);
    }
  };

  return (
    <Dialog TransitionComponent={Transition} onClose={handleClose} open={true}>
      <div className={classes.dialogTitle}>
        <Link href="#">x</Link>
        Wordlist
        <Link  color="primary" href="#">Create</Link>

      </div>

      <DialogContent>
         <WordlistForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClose} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WordlistFormDialog.propTypes = {
  onClose: PropTypes.func
};

export default WordlistFormDialog;
