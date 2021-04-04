import "./index.css";

import { Grid, LinearProgress } from "@material-ui/core";

import LoginImage from "../../components/Images/LoginImage";
import React from "react";

export type LoginPageProps = {
  isLoading: boolean;
};

const LoginPageContainer: React.FC<LoginPageProps> = ({
  children,
  isLoading,
}) => {
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
          {isLoading && <LinearProgress />}
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPageContainer;
