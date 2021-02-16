import "./index.css";

import { Grid } from "@material-ui/core";
import LoginImage from "./Images/LoginImage";
import React from "react";

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (props: LoginPageProps) => {
  return (
    <Grid container className="login-container" direction="row">
      <Grid item xs={12} className="login-item">
        <LoginImage />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
