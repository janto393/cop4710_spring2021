import "./index.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { FieldType } from "./Utils/formUtils";
import HomeContainer from "./containers/HomeContainer";
import LoginForm from "./components/LoginForm";
import LoginPageContainer from "./containers/LoginPageContainer/index";
import RegisterForm from "./components/RegisterForm";
import StudForm from "./components/StudForm";
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
          <HomeContainer>
            <StudForm
              title="Test"
              textFields={[
                {
                  fieldTitle: "Test Field",
                  fieldType: FieldType.IMAGE_UPLOAD,
                  handleOnChange: () => null,
                },
              ]}
              buttonText="Nothing"
            />
          </HomeContainer>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
