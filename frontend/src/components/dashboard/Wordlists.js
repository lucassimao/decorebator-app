import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingLeft: 0,
    paddingRight:0,
    "& .text": { borderBottom: "1px solid #c5c5c5" }
  },

  list: {
    backgroundColor: "white"
  },
  icon: {
    marginRight: theme.spacing(2)
  }
}));

const WordlistLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

function Wordlists(props) {
  const classes = useStyles();
  const { wordlists } = props;

  return (
    <List component="nav" className={classes.list}>
      {wordlists.map(w => (
        <ListItem
          className={classes.listItem}
          key={w._id}
          to={`/wordlists/${w._id}`}
          button
          component={WordlistLink}
        >
          <ListAltRoundedIcon className={classes.icon} />
          <ListItemText className="text" primary={w.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default Wordlists;
