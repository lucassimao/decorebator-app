import InputBase from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import InboxIcon from "@material-ui/icons/Inbox";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import AppFooter from "./components/AppFooter";
import TopBar from "./components/TopBar";

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1, 2),
    color: theme.palette.grey[500],
    "& .section-icon": {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2)
    }
  }
}));

const listStyles = makeStyles(theme => ({
  listItem: {
    paddingLeft: 0,
    "& .text": { borderBottom: "1px solid #c5c5c5" }
  },

  list: {
    backgroundColor: "white",
    padding: theme.spacing(0, 2, 0, 2)
  }
}));

const searchBoxStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.grey[200], //'#eaebed',
    margin: theme.spacing(2),
    marginTop: theme.spacing(9)
  },
  searchIcon: {
    width: theme.spacing(5),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.grey[600]
  },
  inputRoot: {
    color: "inherit",
    fontSize: theme.typography.fontSize * 1.2
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: "100%"
  }
}));

function SearchBox(props) {
  const classes = searchBoxStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search …"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
}

function Wordlists(props) {
  const classes = listStyles();
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

function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TopBar />

      <SearchBox />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Recent wordlists
      </Typography>

      <Wordlists n={5} />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Personal wordlists
      </Typography>

      <Wordlists n={15} />
      <AppFooter />
    </React.Fragment>
  );
}

export default App;
