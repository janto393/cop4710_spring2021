// React imports

import "./index.css";

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { loginTextFields, registerTextFields } from "./Utils/formUtils";

import EventsPage from "./pages/EventsPage";

import LoginPageContainer from "./containers/LoginPageContainer/index";
import StudForms from "./components/StudForms";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* splash page routes */}
        <LoginPageContainer>
          <Route path="/" exact>
            <StudForms
              title="Login"
              textFields={loginTextFields}
              buttonText="Sign in"
            />
          </Route>

          <Route path="/register" exact>
            <StudForms
              title="Register"
              textFields={registerTextFields}
              buttonText="Submit"
            />
          </Route>
        </LoginPageContainer>

        {/* rest of the app will go below */}
				<Route path="/events" exact>
					<EventsPage />
				</Route>
      </Switch>
    </Router>
  );
};

export default App;
