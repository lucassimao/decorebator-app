import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import React from "react";
import { useRouteMatch } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    flexGrow: 1,
    textAlign: "center",
    "& span": {
      fontSize: theme.typography.caption.fontSize
    }
  },
  buttonWrapper: {
    position: "absolute",
    right: theme.spacing(1)
  },
}));



export default function TopBar() {
  const classes = useStyles();
  const match = useRouteMatch("/");
  const isHomePage = match && match.isExact;

  return (
    <AppBar color="primary" position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Decorebator <span> beta </span>
        </Typography>
        {isHomePage && (
          <IconButton
            className={classes.buttonWrapper}
            color="inherit"
            aria-label="user profile"
          >
            <AccountBoxRoundedIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
