import { makeStyles } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import React from "react";
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import { Link, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  breadcrumbs: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1)
  },
  link: {
    display: "flex",
    textDecoration: "none"
  },
  navegableLink: {
    color: "inherit"
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  }
}));

// breadcrumbs by route
const items = {
  "/newWordlist": [{ icon: ListAltRoundedIcon, text: "New Wordlist" }],
  "/wordlists/:id": [{ icon: ListAltRoundedIcon, text: "Wordlist" }]
};

export default function AppBreadcrumb(props) {
  const classes = useStyles();
  const routeMatch = useRouteMatch(Object.keys(items));
  const breadcrumbs = routeMatch ? items[routeMatch.path] : [];


  return (
    <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
      <Link to="/" className={`${classes.link} ${classes.navegableLink}`}>
        <HomeIcon className={classes.icon} /> Home
      </Link>
      {breadcrumbs.map((item, idx) =>
        idx < items.length - 1 ? (
          <Link
            key={idx}
            to={item.path}
            className={`${classes.link} ${classes.navegableLink}`}
          >
            <item.icon className={classes.icon} /> {item.text}
          </Link>
        ) : (
          <Typography key={idx} color="textPrimary" className={classes.link}>
            <item.icon className={classes.icon} />
            {item.text}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
