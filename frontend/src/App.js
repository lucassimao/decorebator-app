import { makeStyles } from "@material-ui/core";
import React, { lazy, Suspense } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProgressModal from "./components/common/ProgressModal";
import { ErrorSnackbar, SuccessSnackbar } from "./components/common/AppSnackbar";
import Main from "./components/home/Main";

const WordlistForm = lazy(() => import("./components/wordlist/Form").then(module => module));
const WordlistFromYoutubeForm = lazy(() =>
  import("./components/wordlist/FormYoutube").then(module => module)
);
const WordlistEdit = lazy(() => import("./components/wordlist/Edit").then(module => module));
const MenuNewWordlist = lazy(() => import("./components/home/MenuNewWordlist").then(module => module));

const useStyles = makeStyles(theme => ({

  wrapper: {
    padding: theme.spacing(2,0),
    height: '100vh',
  }

}));

const spinner = <ProgressModal title="Loading ..." />;

function App(props) {
  const { snackbar, progressModal } = props;
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Router>
        <Switch>
            <Route path="/wordlists/new-from-youtube">
              <Suspense fallback={spinner}>
                <WordlistFromYoutubeForm />
              </Suspense>
            </Route>
            <Route path="/wordlists/new">
              <Suspense fallback={spinner}>
                <WordlistForm />
              </Suspense>
            </Route>
            <Route path="/wordlists/menu">
              <Suspense fallback={spinner}>
                <MenuNewWordlist />
              </Suspense>
            </Route>
            <Route path="/wordlists/:id">
              <Suspense fallback={spinner}>
                <WordlistEdit />
              </Suspense>
            </Route>
            <Route path="/">
              <Main />
            </Route>
        </Switch>
      </Router>

      {/* success snack bar */}
      {snackbar.success && <SuccessSnackbar message={snackbar.message} />}

      {/* error snack bar */}
      {snackbar.error && <ErrorSnackbar message={snackbar.message} />}

      {/* progress modal */}
      {progressModal && <ProgressModal {...progressModal} />}
    </div>
  );
}

const mapStateToProps = state => ({
  snackbar: state.snackbar,
  progressModal: state.progressModal
});

export default connect(mapStateToProps, null)(App);
