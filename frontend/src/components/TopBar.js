import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    flexGrow: 1,
    textAlign: "center",
    "& span": {
      fontSize: theme.typography.caption.fontSize
    }
  },
  addButtonWrapper: {
    position: "absolute",
    right: theme.spacing(1)
  },
  addButton: {
    transform: "scale(1.5)"
  }
}));

const NewWordlistLink = React.forwardRef((props, ref) => (
  <Link to="/newWordlist" innerRef={ref} {...props} />
));

export default function TopBar() {
  const classes = useStyles();
  const match = useRouteMatch("/");
  const isHomePage = match && match.isExact;

  return (
    <div>
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Decorebator <span> beta </span>
          </Typography>
          {isHomePage && (
            <IconButton
              className={classes.addButtonWrapper}
              component={NewWordlistLink}
              color="inherit"
              aria-label="menu"
            >
              <AddRoundedIcon className={classes.addButton} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
