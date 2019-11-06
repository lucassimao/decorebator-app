import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import React, { useEffect } from "react";
import SearchBox from "./SearchBox";
import Wordlists from "./Wordlists";
import { connect } from "react-redux";
import { Container } from "@material-ui/core";
import { fetchUserWordlists, fetchPublicWordlists } from "../../thunks/wordlist.thunks";

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
  const { userWordlists, publicWordlists, loadUserWordlists, loadPublicWordlists } = props;
  const classes = useStyles();

  useEffect(() => {
    loadUserWordlists();
    loadPublicWordlists();
    // eslint-disable-next-line
  }, []);

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

const mapStateToProps = state => ({
  userWordlists: state.wordlists.userWordlists,
  publicWordlists: state.wordlists.publicWordlists
});

const mapDispatchToProps = dispatch => ({
  loadUserWordlists: () => dispatch(fetchUserWordlists()),
  loadPublicWordlists: () => dispatch(fetchPublicWordlists())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
