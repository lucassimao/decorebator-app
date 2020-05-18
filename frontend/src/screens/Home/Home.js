import { Container } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "proptypes";
import React, { lazy, Suspense, useEffect } from "react";
import { connect } from "react-redux";
import ProgressModal from "../../components/ui/ProgressModal";
import { fetchUserWordlists } from "../../thunks/wordlist.thunks";
import SearchBox from "./components/SearchBox";
import Wordlists from "./components/UserWordlists";
const Welcome = lazy(() => import("./Welcome").then(m => m));

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(3, 0, 1, 0),
    fontWeight: "bold",
    color: theme.palette.text.primary
  },

  fab: {
    position: "fixed",
    bottom: theme.spacing(3),
    right: theme.spacing(2)
  },

  container: {
    display: "flex",
    flexDirection: "column",
  },

  wordlistWrapper: {
    borderRadius: theme.shape.borderRadius,
    overflow: "scroll",
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)"
  }
}));

function Home(props) {
  const { userWordlists, loadUserWordlists } = props;
  const classes = useStyles();

  useEffect(() => {
    loadUserWordlists();
    // eslint-disable-next-line
  }, []);

  return (userWordlists?.length > 0 ? (
    <Container className={classes.container}>
      <SearchBox />
      <Typography variant="h5" className={classes.sectionHeader}>
        Your wordlists
      </Typography>

      <div className={classes.wordlistWrapper}>
        <Wordlists wordlists={userWordlists} />
      </div>

      <Fab href="/wordlists/menu" className={classes.fab} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Container>)
    : (
      <Suspense fallback={<ProgressModal title="Loading ..." />}>
        <Welcome />
      </Suspense>
    )
  );
}

const mapStateToProps = state => ({
  userWordlists: state.wordlists.userWordlists
});

const mapDispatchToProps = dispatch => ({
  loadUserWordlists: () => dispatch(fetchUserWordlists())
});

Home.propTypes = {
  userWordlists: PropTypes.array, 
  loadUserWordlists: PropTypes.func
}

export const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(Home);
