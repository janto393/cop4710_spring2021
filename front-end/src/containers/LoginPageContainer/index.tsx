import "./index.css";

import { Grid, LinearProgress } from "@material-ui/core";

import LoginImage from "../../components/Images/LoginImage";
import React from "react";
import { useLoading } from "src/Context/LoadingProvider";

export type LoginPageProps = {};

const LoginPageContainer: React.FC<LoginPageProps> = ({ children }) => {
  const isLoading = useLoading();
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

      <Grid container className="content-container" justify="center">
        <Grid item xs={4} className="content-item">
          {isLoading && <LinearProgress />}
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPageContainer;
