import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import NotificationsActiveRoundedIcon from "@material-ui/icons/NotificationsActiveRounded";
import YouTubeIcon from "@material-ui/icons/YouTube";
import React from "react";
import { Route, Switch } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    top: "auto",
    bottom: 0
  },
  toolBar: { display: "flex", justifyContent: "space-between" }
});

export default function AppFooter() {
  const classes = useStyles();

  const loadWordsFromYoutubeSubtitle = () => {};

  return (
    <AppBar component="footer" position="static" color="primary" className={classes.root}>
      <Toolbar className={classes.toolBar}>
        <Switch>
          <Route path="/wordlists/new"></Route>
          <Route path="/wordlists/:id">
            <IconButton onClick={loadWordsFromYoutubeSubtitle} edge="start" color="inherit">
              <YouTubeIcon />
            </IconButton>
          </Route>
          <Route path="/">
            <IconButton edge="start" color="inherit">
              <ListAltRoundedIcon />
            </IconButton>
            <IconButton color="inherit">
              <NotificationsActiveRoundedIcon />
            </IconButton>
            <IconButton edge="end" color="inherit">
              <AccountBoxRoundedIcon />
            </IconButton>
          </Route>
        </Switch>
      </Toolbar>
    </AppBar>
  );
}
