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
import { DialogTitle, Typography } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  dialogTitle: {
    borderBottom: `2px solid ${theme.palette.grey[500]}`,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[200]
  },
  dialog:{
      borderRadius: theme.spacing(1)
  }
}));

function WordlistFormDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    if (onClose) {
      onClose(selectedValue);
    }
  };

  return (
    <Dialog classes={{paper: classes.dialog}} TransitionComponent={Transition} onClose={handleClose} open={true}>
      <DialogTitle className={classes.dialogTitle}>
          <Typography style={{fontWeight: 'bold'}} align="center">New wordlist</Typography>
      </DialogTitle>

      <DialogContent>
         <WordlistForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WordlistFormDialog.propTypes = {
  onClose: PropTypes.func
};

export default WordlistFormDialog;
