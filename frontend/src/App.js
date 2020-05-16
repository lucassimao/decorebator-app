import { makeStyles } from "@material-ui/core";
import React, { lazy, Suspense } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ErrorSnackbar, SuccessSnackbar } from "./components/ui/AppSnackbar";
import ProgressModal from "./components/ui/ProgressModal";
import HomeScreen from "./screens/Home";

const identity = (arg) => arg
const EmptyWordlistScreen = lazy(() => import("./screens/EmptyWordlist").then(identity));
const YoutubeWordlistScreen = lazy(() => import("./screens/YoutubeWordlist").then(identity));
const EditWordlistScreen = lazy(() => import("./screens/EditWordlist").then(identity));
const NewWordlistScreen = lazy(() => import("./screens/NewWordlist").then(identity));

const useStyles = makeStyles(theme => ({

  wrapper: {
    padding: theme.spacing(2, 0),
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
              <YoutubeWordlistScreen />
            </Suspense>
          </Route>
          <Route path="/wordlists/new">
            <Suspense fallback={spinner}>
              <EmptyWordlistScreen />
            </Suspense>
          </Route>
          <Route path="/wordlists/menu">
            <Suspense fallback={spinner}>
              <NewWordlistScreen />
            </Suspense>
          </Route>
          <Route path="/wordlists/:id">
            <Suspense fallback={spinner}>
              <EditWordlistScreen />
            </Suspense>
          </Route>
          <Route path="/">
            <HomeScreen />
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
