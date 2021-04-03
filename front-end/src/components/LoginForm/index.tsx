import StudForm, { FormFieldType } from "../StudForm";

import React from "react";
import { UserInfoType } from "../../hooks/useRegister";

export type LoginFormProps = {
  registerInfo: UserInfoType;
  setRegisterInfo: Function;
  logIn: Function;
};

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { registerInfo, setRegisterInfo, logIn } = props;
  const { username, password } = registerInfo;

  // formFields for login form
  const loginTextFields: Array<FormFieldType> = [
    {
      label: "email",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({
          ...registerInfo,
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
        setRegisterInfo({ ...registerInfo, password: e.target.value });
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
