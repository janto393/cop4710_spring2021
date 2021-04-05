// React imports

import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import RegisterForm from "./components/RegisterForm";
import { useStudUser } from "./hooks/useStudUser";
import EventsList from "./components/EventList";
import EventForm from "./components/EventForm";

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
					<EventsList
						studUser={studUser}
					/>
				</Route>

				<Route path="/createEvent" exact>
					<EventForm
						studUser={studUser}
					/>
				</Route>
				<Route path="/modifyEvent" exact>
					<EventForm
						studUser={studUser}
					/>
				</Route>
      </Switch>
    </Router>
  );
};

export default App;
