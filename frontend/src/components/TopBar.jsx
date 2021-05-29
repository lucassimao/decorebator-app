import { Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React from "react";
import MenuLink from "../components/ui/MenuLink";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    "& .link": {
      color: "#fff",
      textDecoration: "none",
    },
    "& .link span": {
      fontSize: theme.typography.caption.fontSize,
    },
  },
}));

export default function TopBar() {
  const classes = useStyles();
  const location = useLocation();
  const showNewWordlistButton = !(/\/wordlists\/(\d+)$/).test(location?.pathname)


  return (
    <AppBar color="primary" position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          <Link to="/" className="link">
            Decorebator <span> beta </span>
          </Link>
        </Typography>
        {showNewWordlistButton && <Button component={MenuLink} color="inherit">
          New wordlist
        </Button>}
        <IconButton
          className={classes.buttonWrapper}
          color="inherit"
          aria-label="user profile"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
