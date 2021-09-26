import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import App from "./App";
import { apolloClient } from "./graphql/client";
import "./index.css";
import { rootReducer } from "./redux/reducers";
import * as serviceWorker from "./serviceWorker";
import theme from "./theme";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

if (process.env.NODE_ENV === 'production') {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "woven-gist-296814.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: "woven-gist-296814.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  let authorization = localStorage.getItem('authorization')
  if (!authorization) {
    authorization = document.cookie
      .split('; ')
      .find(row => row.startsWith('authorization='))
      .split('=')[1];
    localStorage.setItem('authorization', authorization)
  }
}


const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
