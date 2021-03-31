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
import { UserInfoType } from "../RegisterForm";
import { useHistory } from "react-router-dom"

export type FormFieldType = {
  label: string;
  inputType?: string;
  fieldType: string;
  selectItems?: Array<string>
};

export type FormPropsType = {
  title: string;
  textFields: Array<FormFieldType>;
  buttonText: string;
  handleClick?: Function;
  handleBackClick?: Function;
  registerInfo?: UserInfoType;
  setRegisterInfo?: Function;
  step?: number;
};

const StudForm: React.FC<FormPropsType> = (props: FormPropsType) => {
  const { 
    title, 
    textFields, 
    buttonText, 
    handleClick = () => null, 
    handleBackClick = () => null, 
    registerInfo = {}, 
    setRegisterInfo = () => null,
    step = 1 
  } = props;
  
  const history = useHistory()
  const { location } = history

  const canGoBack = step > 1
  const isLoginOrRegister: boolean = title === "Login" || title === "Register";
  const redirectButtonText: string =
    title === "Login"
      ? "Don't have an account? Sign up!"
      : "Already have an account?";

  // routes to login/signup
  const handleRedirect = () => {
    // checks current path and redirects to the either register or login
    location.pathname === '/' ? history.push('/register') : history.push('/')
  }

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
            const { label, inputType = 'email', fieldType, selectItems = [] } = field;
            switch (fieldType) {
              case 'textField':
                return <StudTextField label={label} type={inputType} />
              case 'dropDown':
                return <StudSelect label={label} selectItems={selectItems} setRegisterInfo={setRegisterInfo} registerInfo={registerInfo} />
              default:
                console.log('textfield not available: create component and add to switch statement')
            }
          })}
        </Grid>

        {/* buttons */}
        <Grid container className="button-container">
          <Grid item xs={12} className="button-submit-item">
            <Button variant="contained" className="button-submit" onClick={() => handleClick()}>
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      </CardContent>

        <Grid container className="button-container">
          {/* back button */}
          {canGoBack && (
            <Grid item xs={6} className="back-button">
            <CardActions onClick={() => handleBackClick()}>
              <Button size='small'>Back</Button>
            </CardActions>
          </Grid>
          )}
          {/* login/register page redirect */}
          
            <Grid item xs={canGoBack ? 6 : 12} className="button-redirect-item">
              <Button variant="text" className="button-redirect" onClick={handleRedirect}>
                {redirectButtonText}
              </Button>
            </Grid>
          
        </Grid>
    </Card>
  )
};

export default StudForm;
