import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import PropTypes from "proptypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "fit-content",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 2, 3, 2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  description: {
    marginLeft: theme.spacing(2),
  },
  modalBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function ProgressModal(props) {
  const { title, description = "" } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      open={open}
      onClose={handleClose}
    >
      <div className={classes.paper}>
        <h2 id="modal-title">{title}</h2>
        <div className={classes.modalBody}>
          <CircularProgress />
          {description && (
            <Typography
              className={classes.description}
              id="modal-description"
              variant="subtitle1"
            >
              {description}
            </Typography>
          )}
        </div>
      </div>
    </Modal>
  );
}

ProgressModal.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};
