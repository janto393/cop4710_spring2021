import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import HomeContainer from "./containers/HomeContainer";
import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import RegisterForm from "./components/RegisterForm";
import { useState } from "react";
import { useStudUser } from "./hooks/useStudUser";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { studUser, setStudUser } = useStudUser();

  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <Route path="/" exact>
          <LoginPageContainer isLoading={isLoading}>
            <LoginForm
              studUser={studUser}
              setStudUser={setStudUser}
              setIsLoading={setIsLoading}
            />
          </LoginPageContainer>
        </Route>

        <Route path="/register" exact>
          <LoginPageContainer isLoading={isLoading}>
            <RegisterForm
              studUser={studUser}
              setStudUser={setStudUser}
              setIsLoading={setIsLoading}
            />
          </LoginPageContainer>
        </Route>

        {/* rest of the app will go below */}
        <Route path="/home" exact>
          <HomeContainer></HomeContainer>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
