// React imports

import "./index.css";

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import LoginPage from "./components/LoginPage/index";
import React from "react";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
