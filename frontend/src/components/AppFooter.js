import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import NotificationsActiveRoundedIcon from "@material-ui/icons/NotificationsActiveRounded";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    top: "auto",
    bottom: 0
  },
  toolBar: { display: "flex", justifyContent: "space-between" }
});

export default function AppFooter() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="primary" className={classes.root}>
      <Toolbar className={classes.toolBar}>
        <IconButton edge="start" color="inherit">
          <ListAltRoundedIcon />
        </IconButton>
        <IconButton color="inherit">
          <NotificationsActiveRoundedIcon />
        </IconButton>
        <IconButton edge="end" color="inherit">
          <AccountBoxRoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
