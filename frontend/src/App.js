import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppFooter from "./components/AppFooter";
import Home from "./components/dashboard/Home";
import TopBar from "./components/TopBar";
import { connect } from "react-redux";
import { SuccessSnackbar, ErrorSnackbar } from "./components/common/AppSnackbar";

const WordlistForm = lazy(() => import('./components/WordlistForm').then(module => module))

function App(props) {
  const { snackbar } = props;

  return (
    <>
      <Router>
        <TopBar />
        <Switch>
          <Route path="/newWordlist">
            <Suspense fallback={<div> wait ...</div>}>
              <WordlistForm />
            </Suspense>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <AppFooter />
      </Router>

      {/* success snack bar */}
      {snackbar.success && (
        <SuccessSnackbar message={snackbar.message} />
      )}


      {/* error snack bar */}
      {snackbar.error && <ErrorSnackbar message={snackbar.message} />}

    </>
  );
}

const mapStateToProps = state => ({
  snackbar: state.snackbar
});

export default connect(mapStateToProps,null)(App);

