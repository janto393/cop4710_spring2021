import "./index.css";

import { Grid } from "@material-ui/core";
import LoginImage from "../../components/Images/LoginImage";
import React from "react";

const LoginPageContainer: React.FC = ({ children }) => {
  return (
    <>
      <Grid
        container
        className="login-container"
        direction="row"
        justify="center"
      >
        <Grid item xs={4} className="login-img-item">
          <LoginImage />
        </Grid>
      </Grid>

      <Grid container className="login-card-container" justify="center">
        <Grid item xs={4}>
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPageContainer;
