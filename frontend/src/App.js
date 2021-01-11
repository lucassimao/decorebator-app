import { makeStyles } from "@material-ui/core";
import PropTypes from "proptypes";
import React, { lazy, Suspense } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ErrorSnackbar, SuccessSnackbar } from "./components/ui/AppSnackbar";
import ProgressModal from "./components/ui/ProgressModal";
import HomeScreen from "./screens/Home";

const identity = (arg) => arg
const EmptyWordlistScreen = lazy(() => import("./screens/EmptyWordlist").then(identity));
const YoutubeWordlistScreen = lazy(() => import("./screens/YoutubeWordlist").then(identity));
const FileWordlistScreen = lazy(() => import("./screens/FileWordlist").then(identity));
const EditWordlistScreen = lazy(() => import("./screens/EditWordlist").then(identity));
const NewWordlistScreen = lazy(() => import("./screens/NewWordlist").then(identity));
const QuizzScreen = lazy(() => import("./screens/Quizz").then(identity));

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
        <Suspense fallback={spinner}>
          <Switch>
            <Route path="/wordlists/new-from-file">
              <FileWordlistScreen />
            </Route>
            <Route path="/wordlists/new-from-youtube">
              <YoutubeWordlistScreen />
            </Route>
            <Route path="/wordlists/new">
              <EmptyWordlistScreen />
            </Route>
            <Route path="/wordlists/menu">
              <NewWordlistScreen />
            </Route>
            <Route path="/wordlists/:id/quizzes">
              <QuizzScreen />
            </Route> 
            <Route path="/wordlists/:id">
              <EditWordlistScreen />
            </Route>
            <Route path="/">
              <HomeScreen />
            </Route>
          </Switch>
        </Suspense>
      </Router>

      {snackbar.success && <SuccessSnackbar message={snackbar.message} />}
      {snackbar.error && <ErrorSnackbar message={snackbar.message} />}
      {progressModal && <ProgressModal {...progressModal} />}
    </div>
  );
}

const mapStateToProps = state => ({
  snackbar: state.snackbar,
  progressModal: state.progressModal
});

App.propTypes = {
  snackbar: PropTypes.shape({ success: PropTypes.bool, error: PropTypes.bool, message: PropTypes.string }),
  progressModal: PropTypes.shape({ title: PropTypes.string, message: PropTypes.string })
}

export default connect(mapStateToProps, null)(App);
