// React imports

import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import RegisterForm from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";

const App = () => {
  const {
    registerInfo,
    setRegisterInfo,
    submitUserRegistration,
    isLoading,
    logIn,
  } = useRegister();

  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <Route path="/" exact>
          <LoginPageContainer isLoading={isLoading}>
            <LoginForm
              registerInfo={registerInfo}
              setRegisterInfo={setRegisterInfo}
              logIn={logIn}
            />
          </LoginPageContainer>
        </Route>

        <Route path="/register" exact>
          <LoginPageContainer isLoading={isLoading}>
            <RegisterForm
              registerInfo={registerInfo}
              setRegisterInfo={setRegisterInfo}
              registerUser={submitUserRegistration}
            />
          </LoginPageContainer>
        </Route>

        {/* rest of the app will go below */}
        <Route path="/home" exact></Route>
      </Switch>
    </Router>
  );
};

export default App;
