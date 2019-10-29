import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/Inbox";
import React from "react";

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingLeft: 0,
    "& .text": { borderBottom: "1px solid #c5c5c5" }
  },

  list: {
    backgroundColor: "white",
    padding: theme.spacing(0, 2, 0, 2)
  }
}));

function Wordlists(props) {
  const classes = useStyles();
  const { n } = props;
  const listItems = [];

  for (let i = 0; i < n; ++i) {
    listItems.push(
      <ListItem className={classes.listItem} key={i} button>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText className="text" primary={"Wordlist " + i} />
      </ListItem>
    );
  }

  return (
    <List component="nav" className={classes.list}>
      {listItems}
    </List>
  );
}

export default Wordlists;
