import "./index.css";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";

import React from "react";
import StudSelect from "../StudSelect";
import StudTextField from "../StudTextField";
import { UserInfoType } from "../../hooks/useStudUser";
import { useHistory } from "react-router-dom";

// fields that should be passed into formField
export type FormFieldType = {
  label: string;
  inputType?: string;
  fieldType: string;
  selectItems?: Array<string>;
  handleOnChange: Function;
};

// fields that should be passed into component
export type FormPropsType = {
  title: string;
  textFields: Array<FormFieldType>;
  buttonText: string;
  studUser?: UserInfoType;
  handleClick?: Function;
  handleBackClick?: Function;
  setStudUser?: Function;
};

const StudForm: React.FC<FormPropsType> = (props: FormPropsType) => {
  const { title, textFields, buttonText, handleClick = () => null } = props;

  // used to redirect to a different route
  const history = useHistory();
  const { location } = history;

  const redirectButtonText: string =
    title === "Login"
      ? "Don't have an account? Sign up!"
      : "Already have an account?";

  // routes to login/signup
  const handleRedirect = () => {
    // checks current path and redirects to the either register or login
    location.pathname === "/" ? history.push("/register") : history.push("/");
  };

  return (
    <Card className="login-card" variant="elevation">
      <CardContent>
        <Grid container direction="row" className="input-field-container">
          {/* form title */}
          <Typography variant="h4" className="form-title">
            {title}
          </Typography>

          {/* renders all of the fields */}
          {textFields.map((field) => {
            const {
              label,
              inputType = "email",
              fieldType,
              selectItems = [],
              handleOnChange = () => null,
            } = field;

            // only supports text and select fields. can add more below in switch
            switch (fieldType) {
              case "textField":
                return (
                  <StudTextField
                    label={label}
                    type={inputType}
                    handleOnChange={() => handleOnChange}
                  />
                );
              case "dropDown":
                return (
                  <StudSelect
                    label={label}
                    selectItems={selectItems}
                    handleOnChange={() => handleOnChange}
                  />
                );
              default:
                console.log(
                  "textfield not available: create component and add to switch statement"
                );
            }
          })}
        </Grid>

        {/* buttons */}
        <Grid container className="button-container">
          <Grid item xs={12} className="button-submit-item">
            <Button
              variant="contained"
              className="button-submit"
              onClick={() => handleClick()}
            >
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      {/* login/register page redirect */}
      <Grid container className="button-container">
        <Grid item xs={12} className="button-redirect-item">
          <Button
            variant="text"
            className="button-redirect"
            onClick={handleRedirect}
          >
            {redirectButtonText}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StudForm;