import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import React from "react";
import AppFooter from "./components/AppFooter";
import SearchBox from "./components/dashboard/SearchBox";
import Wordlists from "./components/dashboard/Wordlists";
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


function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TopBar />

      <SearchBox />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Personal wordlists
      </Typography>

      <Wordlists n={5} />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Recent wordlists
      </Typography>

      <Wordlists n={10} />

      <AppFooter />
    </React.Fragment>
  );
}

export default App;
