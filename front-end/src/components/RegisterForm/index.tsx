import "./index.css";

import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import React from "react";

const RegisterForm: React.FC = () => {
  const getTitle = (
    <Typography variant="h3" className="form-title">
      Register
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

  const getPasswordConfirm = (
    <Grid item xs={12} className="input-field-item">
      <TextField
        variant="outlined"
        color="secondary"
        fullWidth
        className="input"
        label="Confirm Password"
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
          {getPasswordConfirm}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
