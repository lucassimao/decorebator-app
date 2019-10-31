import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppFooter from "./components/AppFooter";
import Home from "./components/dashboard/Home";
import TopBar from "./components/TopBar";

const WordlistForm = lazy(() => import('./components/WordlistForm').then(module => module))


function App() {

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
    </>
  );
}

export default App;
