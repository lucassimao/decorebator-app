import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import React, { useState, Suspense } from "react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const WordlistFormDialog = React.lazy(() => import("./dialogs/WordlistFormDialog"));

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    flexGrow: 1,
    textAlign: "center",
    "& span": {
      fontSize: theme.typography.caption.fontSize
    }
  },
  addButton: {
    transform: "scale(1.5)"
  }
}));

export default function TopBar() {
  const classes = useStyles();
  const [showPopup, setShowPopup] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const onAddWordlistClick = event => {
      if (matches){
          setShowPopup(true);
      }
  };

  return (
    <div>
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Decorebator <span> beta </span>
          </Typography>
          <IconButton onClick={onAddWordlistClick} edge="start" color="inherit" aria-label="menu">
            <AddRoundedIcon className={classes.addButton} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {showPopup && (
        <Suspense fallback={<div>Loading ...</div>}>
          <WordlistFormDialog />
        </Suspense>
      )}
    </div>
  );
}
