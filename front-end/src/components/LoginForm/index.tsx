import { FormFieldType } from "../../types/formTypes";
import React from "react";
import StudForm from "../StudForm";
import { UserInfoType } from "../../hooks/useStudUser";
import { useHistory } from "react-router";

export type LoginFormProps = {
  studUser: UserInfoType;
  setStudUser: Function;
  logIn: Function;
};

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { studUser, setStudUser, logIn } = props;
  const { username, password } = studUser;
  const history = useHistory();

  // formFields for login form
  const loginTextFields: Array<FormFieldType> = [
    {
      fieldTitle: "email",
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
      fieldTitle: "password",
      inputTypePassword: true,
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
      handleClick={() => logIn(username, password, history)}
    />
  );
};

export default LoginForm;
