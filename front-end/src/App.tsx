import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import EventForm from "./components/EventForm";
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
          <HomeContainer>
            {/* Events list will go here */}
          </HomeContainer>
        </Route>

        <Route path="/createEvent" exact>
          <HomeContainer>
            <EventForm studUser={studUser} />
          </HomeContainer>
        </Route>
        <Route path="/modifyEvent" exact>
          <EventForm studUser={studUser} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
