import "./index.css";

import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import React from "react";

const LoginForm: React.FC = () => {
  const getTitle = (
    <Typography variant="h3" className="form-title">
      Login
    </Typography>
  );

  const getEmailField = (
    <Grid item xs={12} className="input-field-item">
      <TextField
        variant="outlined"
        color="secondary"
        fullWidth
        className="input"
        label="Email"
        type="email"
      />
    </Grid>
  );

  const getPasswordField = (
    <Grid item xs={12} className="input-field-item">
      <TextField
        variant="outlined"
        color="secondary"
        fullWidth
        className="input"
        label="Password"
        type="password"
      />
    </Grid>
  );

  return (
    <Card className="login-card" variant="elevation">
      <CardContent>
        <Grid container direction="row" className="input-field-container">
          {getTitle}
          {getEmailField}
          {getPasswordField}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
