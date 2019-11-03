import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import React from "react";
import SearchBox from "./SearchBox";
import Wordlists from "./Wordlists";
import { connect } from "react-redux";

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

function Home(props) {
  const {userWordlists} = props;
  const classes = useStyles();


  return (
    <>
      <SearchBox />
      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Personal wordlists
      </Typography>
      <Wordlists wordlists={userWordlists} />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Recent wordlists
      </Typography>

      <Wordlists wordlists={[]} />
    </>
  );
}


const mapStateToProps = (state) =>({
  userWordlists : state.wordlists.userWordlists,
})

export default connect(mapStateToProps,null)(Home);