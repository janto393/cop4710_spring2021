import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { Grid } from "@material-ui/core";
import HomeContainer from "./containers/HomeContainer";
import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import StudForm from "./components/StudForm";
import { useStudUser } from "./hooks/useStudUser";

const App = () => {
  const {
    studUser,
    setStudUser,
    submitUserRegistration,
    logIn,
    isLoading,
  } = useStudUser();

  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <Route path="/" exact>
          <LoginPageContainer isLoading={isLoading}>
            <LoginForm
              studUser={studUser}
              setStudUser={setStudUser}
              logIn={logIn}
            />
          </LoginPageContainer>
        </Route>

        <Route path="/register" exact>
          <LoginPageContainer isLoading={isLoading}>
            <RegisterForm
              studUser={studUser}
              setStudUser={setStudUser}
              registerUser={submitUserRegistration}
            />
          </LoginPageContainer>
        </Route>

        {/* rest of the app will go below */}
        <Route path="/home" exact>
          <HomeContainer>
            <StudForm
              title="Test form"
              textFields={[
                {
                  fieldTitle: "Test",
                  fieldType: "imageUploader",
                  handleOnChange: () => null,
                },
              ]}
              buttonText="submit"
            />
          </HomeContainer>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
