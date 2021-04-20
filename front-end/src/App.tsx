import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import EventForm from "./components/EventForm";
import Events from "./components/Event";
import HomeContainer from "./containers/HomeContainer";
import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import RegisterForm from "./components/RegisterForm";
import RegisterRsoForm from "./components/RegisterRsoForm";
import { useState } from "react";
import { useStudUser } from "./hooks/useStudUser";
import ViewRequests from "./components/ViewRequests";
import JoinLeaveRSO from "./components/JoinLeaveRSO";

const App = () => {
  const { studUser, setStudUser } = useStudUser();
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
          <LoginPageContainer>
            <LoginForm setStudUser={setStudUser} />
          </LoginPageContainer>
        </Route>

        <Route path="/register" exact>
          <LoginPageContainer>
            <RegisterForm setStudUser={setStudUser} />
          </LoginPageContainer>
        </Route>

        {/* rest of the app will go below */}
        <Route path="/home" exact>
          <HomeContainer studUser={studUser}>
            <Events studUser={studUser} />
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
            <ViewRequests studUser={studUser} />
          </HomeContainer>
        </Route>

        <Route path="/join" exact>
          <HomeContainer
            isValid={isValid}
            canDisplayToast={canDisplayToast}
            setCanDisplayToast={setCanDisplayToast}
          >
            <JoinLeaveRSO studUser={studUser} />
          </HomeContainer>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
