import { makeStyles } from "@material-ui/core";
import React, { lazy, Suspense } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProgressModal from "./components/common/ProgressModal";
import AppFooter from "./components/AppFooter";
import {
  ErrorSnackbar,
  SuccessSnackbar
} from "./components/common/AppSnackbar";
import Home from "./components/dashboard/Home";
import TopBar from "./components/TopBar";

const WordlistForm = lazy(() =>
  import("./components/wordlist/WordlistForm").then(module => module)
);
const WordlistEdit = lazy(() =>
  import("./components/wordlist/Edit").then(module => module)
);

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(8),
    position: 'relative',
    // paddingBottom: theme.spacing(19),
    border: '1px solid green'
  }
}));

const spinner = <ProgressModal title="Loading ..." />;

function App(props) {
  const { snackbar, progressModal } = props;
  const classes = useStyles();

  return (
    <>
      <Router>
        <TopBar />
        <main className={classes.main}>
          <Switch>
            <Route path="/newWordlist">
              <Suspense fallback={spinner}>
                <WordlistForm />
              </Suspense>
            </Route>
            <Route path="/wordlists/:id">
              <Suspense fallback={spinner}>
                <WordlistEdit />
              </Suspense>
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </main>
        <AppFooter />
      </Router>

      {/* success snack bar */}
      {snackbar.success && <SuccessSnackbar message={snackbar.message} />}

      {/* error snack bar */}
      {snackbar.error && <ErrorSnackbar message={snackbar.message} />}

      {/* progress modal */}
      {progressModal && <ProgressModal {...progressModal} />}
    </>
  );
}

const mapStateToProps = state => ({
  snackbar: state.snackbar,
  progressModal: state.progressModal
});

export default connect(
  mapStateToProps,
  null
)(App);
