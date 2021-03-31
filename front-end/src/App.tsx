// React imports

import "./index.css";

import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import LoginPageContainer from "./containers/LoginPageContainer/index";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import StudForm from "./components/StudForm";

const App = () => {
  // 1. create hook to maintain user state while they create an account
  // 2. create <StudLogin path="/" user={user} /> to encapsulate login form logic and callback
  // 3. same for register

  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <LoginPageContainer>
          <Route path="/" exact>
            <StudForm
              title="Login"
              textFields={[{label: 'email', fieldType: 'textField'}, {label: 'password', inputType: 'password', fieldType: 'textField'}]}
              buttonText="Sign in"
            />
          </Route>

          <Route path="/register" exact>
            <RegisterForm />
          </Route>
        </LoginPageContainer>

        {/* rest of the app will go below */}
        <Route path="/home" exact>
          
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
