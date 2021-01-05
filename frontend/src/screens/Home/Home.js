import { Container } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuLink from "../../components/ui/MenuLink";
import ProgressModal from "../../components/ui/ProgressModal";
import { fetchUserWordlists } from "../../redux/wordlists/actions";
import SearchBox from "./components/SearchBox";
import Wordlists from "./components/UserWordlists";
import { useStyles } from "./home.styles";

const Welcome = lazy(() => import("./Welcome").then(m => m));

export const HomeScreen = () => {
  const classes = useStyles();
  const userWordlists = useSelector(state => state.wordlists.userWordlists)
  const isFetchingWordlists = useSelector(state => state.wordlists.isFetchingUserWordlists)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserWordlists())
  }, [dispatch]);

  if (!userWordlists?.length && isFetchingWordlists ) {
    return <ProgressModal title="Loading ..." />;
  }

  if (!userWordlists?.length) {
    return <Suspense fallback={<ProgressModal title="Loading ..." />}>
      <Welcome />
    </Suspense>
  }

  return <Container className={classes.container}>
    <SearchBox />
    <Typography variant="h5" className={classes.sectionHeader}>
      Your wordlists
      </Typography>

    <div className={classes.wordlistWrapper}>
      <Wordlists wordlists={userWordlists} />
    </div>

    <Fab component={MenuLink} className={classes.fab} color="primary" aria-label="add">
      <AddIcon />
    </Fab>
  </Container>;
}