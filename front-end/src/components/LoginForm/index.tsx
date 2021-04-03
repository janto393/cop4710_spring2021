import StudForm, { FormFieldType } from "../StudForm";

import React from "react";
import { UserInfoType } from "../../hooks/userStudUser";

export type LoginFormProps = {
  studUser: UserInfoType;
  setStudUser: Function;
  logIn: Function;
};

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { studUser, setStudUser, logIn } = props;
  const { username, password } = studUser;

  // formFields for login form
  const loginTextFields: Array<FormFieldType> = [
    {
      label: "email",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setStudUser({
          ...studUser,
          email: e.target.value,
          username: e.target.value,
        });
      },
    },
    {
      label: "password",
      inputType: "password",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setStudUser({ ...studUser, password: e.target.value });
      },
    },
  ];

  return (
    <StudForm
      title="Login"
      textFields={loginTextFields}
      buttonText="Sign in"
      handleClick={() => logIn(username, password)}
    />
  );
};

export default LoginForm;
