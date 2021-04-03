// React imports

import "./index.css";

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { loginTextFields, registerTextFields } from "./Utils/formUtils";

import CreateEventPage from "./pages/CreateEventPage";
import EventsPage from "./pages/EventsPage";

import LoginPageContainer from "./containers/LoginPageContainer/index";
import StudForms from "./components/StudForms";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* splash page routes */}
          <Route path="/" exact>
						<LoginPageContainer>
							<StudForms
								title="Login"
								textFields={loginTextFields}
								buttonText="Sign in"
							/>
						</LoginPageContainer>
          </Route>

          <Route path="/register" exact>
						<LoginPageContainer>
							<StudForms
								title="Register"
								textFields={registerTextFields}
								buttonText="Submit"
							/>
						</LoginPageContainer>
          </Route>

        {/* rest of the app will go below */}
				<Route path="/createEvent" exact>
					<CreateEventPage />
				</Route>
				<Route path="/events" exact>
					<EventsPage />
				</Route>
      </Switch>
    </Router>
  );
};

export default App;
