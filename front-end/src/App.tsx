// React imports

import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { LinearProgress } from "@material-ui/core";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import StudForm from "./components/StudForm";
import { useRegister } from "./hooks/useRegister";

const App = () => {
  const {
    registerInfo,
    setRegisterInfo,
    registerUser,
    isLoading,
  } = useRegister();

  const loginTextFields = [
    {
      label: "email",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({ ...registerInfo, email: e.target.value });
      },
    },
    {
      label: "password",
      inputType: "password",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({ ...registerInfo, password: e.target.value });
      },
    },
  ];

  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <LoginPageContainer>
          {isLoading && <LinearProgress />}
          <Route path="/" exact>
            <StudForm
              title="Login"
              textFields={loginTextFields}
              buttonText="Sign in"
              handleClick={registerUser} // add signInUser fn
            />
          </Route>
          <Route path="/register" exact>
            <RegisterForm
              registerInfo={registerInfo}
              setRegisterInfo={setRegisterInfo}
              registerUser={registerUser}
            />
          </Route>
        </LoginPageContainer>
        {/* rest of the app will go below */}
        <Route path="/home" exact></Route>
      </Switch>
    </Router>
  );
};

export default App;
