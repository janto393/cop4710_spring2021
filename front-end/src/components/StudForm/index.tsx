import "./index.css";

import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";

import { FormFieldType } from "../../types/formTypes";
import ImageUpload from "../ImageUpload";
import React from "react";
import StudSelect from "../StudSelect";
import StudTextField from "../StudTextField";
import { useHistory } from "react-router-dom";

// fields that should be passed into component
export type FormPropsType = {
  title: string;
  textFields: Array<FormFieldType>;
  buttonText: string;
  handleClick?: Function;
};

const StudForm: React.FC<FormPropsType> = (props: FormPropsType) => {
  const { title, textFields, buttonText, handleClick = () => null } = props;
  const history = useHistory();
  const { location } = history;

  const isLoginOrRegisterForm = title === "Login" || title === "Register";
  const redirectButtonText: string =
    title === "Login"
      ? "Don't have an account? Sign up!"
      : "Already have an account?";

  // routes to login/signup
  const handleRedirect = () => {
    location.pathname === "/" ? history.push("/register") : history.push("/");
  };

  const getFormTitle = (
    <Typography variant="h4" className="form-title">
      {title}
    </Typography>
  );

  const getFormFields = (textFields: Array<FormFieldType>) => {
    return textFields.map((field) => {
      const {
        fieldTitle: label = "",
        isPasswordField: inputTypePassword = false,
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
              inputType={inputTypePassword ? "password" : "email"}
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
        case "imageUploader":
          return <ImageUpload handleOnChange={handleOnChange} />;
        default:
          console.log(
            "textfield not available: create component and add to switch statement"
          );
      }
    });
  };

  const getFormActionButton = (
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
  );

  const getRedirectButton = (
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
  );

  return (
    <Card className="form-card" variant="elevation">
      <CardContent>
        <Grid container direction="row" className="input-field-container">
          {/* form title */}
          {getFormTitle}

          {/* form fields */}
          {getFormFields(textFields)}
        </Grid>

        {/* submit button */}
        {getFormActionButton}
      </CardContent>

      {/* login/register page redirect */}
      {isLoginOrRegisterForm && getRedirectButton}
    </Card>
  );
};

export default StudForm;
