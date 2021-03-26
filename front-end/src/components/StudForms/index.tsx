import "./index.css";

import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import React from "react";
import { useHistory } from "react-router-dom"

export type FormFieldType = {
  label: string;
  type: string;
};

export type FormPropsType = {
  title: string;
  textFields: Array<FormFieldType>;
  buttonText: string;
};

const StudForms: React.FC<FormPropsType> = (props: FormPropsType) => {
  const { title, textFields, buttonText } = props;
  const history = useHistory()
  const { location } = history

  const isLoginOrRegister: boolean = title === "Login" || title === "Register";
  const redirectButtonText: string =
    title === "Register"
      ? "Already have an account?"
      : "Don't have an account? Sign up!";

  // routes to login/signup
  const handleRedirect = () => {
    // checks current path and redirects to the either register or login
    location.pathname === '/' ? history.push('/register') : history.push('/')
  }

  // logs user in or creates account -> logs user in
  const handleOnClick = () => {
    console.log('user login/create account!')
  }

  return (
    <Card className="login-card" variant="elevation">
      <CardContent>
        <Grid container direction="row" className="input-field-container">
          {/* form title */}
          <Typography variant="h4" className="form-title">
            {title}
          </Typography>

          {/* renders all of the text fields */}
          {textFields.map((field) => {
            const { label, type } = field;

            // TODO: have diff opitons for the different fields and return that
            return (
              <Grid item xs={12} className="input-field-item">
                <TextField
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  className="input"
                  label={label}
                  type={type}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* buttons */}
        <Grid container className="button-container">
          <Grid item xs={12} className="button-submit-item">
            <Button variant="contained" className="button-submit" onClick={handleOnClick}>
              {buttonText}
            </Button>
          </Grid>

          {/* login/register page redirect */}
          {isLoginOrRegister && (
            <Grid item xs={12} className="button-redirect-item">
              <Button variant="text" className="button-redirect" onClick={handleRedirect}>
                {redirectButtonText}
              </Button>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StudForms;
