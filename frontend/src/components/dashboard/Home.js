import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import React from "react";
import SearchBox from "./SearchBox";
import Wordlists from "./Wordlists";
import { connect } from "react-redux";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1, 0),
    color: theme.palette.grey[500],
    "& .section-icon": {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2)
    }
  }
}));

function Home(props) {
  const {userWordlists, publicWordlists} = props;
  const classes = useStyles();


  return (
    <Container>
      <SearchBox />
      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Your wordlists
      </Typography>
      <Wordlists wordlists={userWordlists} />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Recent public wordlists
      </Typography>

      <Wordlists wordlists={publicWordlists} />
    </Container>
  );
}


const mapStateToProps = (state) =>({
  userWordlists : state.wordlists.userWordlists,
  publicWordlists : state.wordlists.publicWordlists
})

export default connect(mapStateToProps,null)(Home);