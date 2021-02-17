// React imports

import "./index.css";

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import React from "react";
import RegisterForm from "./components/RegisterForm";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPageContainer>
            <LoginForm />
          </LoginPageContainer>
        </Route>

        <Route path="/register" exact>
          <LoginPageContainer>
            <RegisterForm />
          </LoginPageContainer>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
