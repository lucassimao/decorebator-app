import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingLeft: 0,
    "& .text": { borderBottom: "1px solid #c5c5c5" }
  },

  list: {
    backgroundColor: "white",
  }
}));

const WordlistLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

function Wordlists(props) {
  const classes = useStyles();
  const { wordlists } = props;

  return (
    <List component="nav" className={classes.list}>
      {wordlists.map(w => (
        <ListItem className={classes.listItem} key={w._id} to={`/wordlists/${w._id}`} button component={WordlistLink}>
          <ListItemIcon>
            <ListAltRoundedIcon />
          </ListItemIcon>
          <ListItemText className="text" primary={w.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default Wordlists;
