import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import EventForm from "./components/EventForm";
import HomeContainer from "./containers/HomeContainer";
import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import RegisterForm from "./components/RegisterForm";
import RegisterRsoForm from "./components/RegisterRsoForm";
import { useState } from "react";
import { useStudUser } from "./hooks/useStudUser";

const App = () => {
  const { studUser, setStudUser } = useStudUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [canDisplayToast, setCanDisplayToast] = useState(false);

  // Account Tiers
  // 3. super admin -> canSee(everything)
  // 2. rso -> canSee('home', 'register rso', 'view requests')
  // 1. student -> canSee('home', 'register rso')

  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <Route path="/" exact>
          <LoginPageContainer isLoading={isLoading}>
            <LoginForm setStudUser={setStudUser} setIsLoading={setIsLoading} />
          </LoginPageContainer>
        </Route>

        <Route path="/register" exact>
          <LoginPageContainer isLoading={isLoading}>
            <RegisterForm
              setStudUser={setStudUser}
              setIsLoading={setIsLoading}
            />
          </LoginPageContainer>
        </Route>

        {/* rest of the app will go below */}
        <Route path="/home" exact>
          <HomeContainer studUser={studUser}>
            <h1>Events go here</h1>
          </HomeContainer>
        </Route>

        <Route path="/createEvent" exact>
          <HomeContainer
            isValid={isValid}
            canDisplayToast={canDisplayToast}
            setCanDisplayToast={setCanDisplayToast}
          >
            <EventForm
              studUser={studUser}
              setIsValid={setIsValid}
              setCanDisplayToast={setCanDisplayToast}
            />
          </HomeContainer>
        </Route>

        <Route path="/registerRso" exact>
          <HomeContainer
            isValid={isValid}
            canDisplayToast={canDisplayToast}
            setCanDisplayToast={setCanDisplayToast}
          >
            <RegisterRsoForm
              studUser={studUser}
              setIsLoading={setIsLoading}
              setIsValid={setIsValid}
              setCanDisplayToast={setCanDisplayToast}
            />
          </HomeContainer>
        </Route>

        <Route path="/viewRequests" exact>
          <HomeContainer
            isValid={isValid}
            canDisplayToast={canDisplayToast}
            setCanDisplayToast={setCanDisplayToast}
          >
            <h1>View Requests</h1>
          </HomeContainer>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
