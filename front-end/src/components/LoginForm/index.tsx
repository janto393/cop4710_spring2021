import { FormFieldType } from "../../types/formTypes";
import React from "react";
import StudForm from "../StudForm";
import { UserInfoType } from "../../hooks/useStudUser";
import axios from "axios";
import { useHistory } from "react-router";

export type LoginFormProps = {
  studUser: UserInfoType;
  setStudUser: Function;
  setIsLoading: Function;
};

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { studUser, setStudUser, setIsLoading } = props;
  const { username, password } = studUser;
  const history = useHistory();

  const logIn = async (username: string, password: string, history: any) => {
    setIsLoading(true);

    // TODO: IMPLEMENT FORM ERROR CHECKING HERE
    const response = await axios.post("http://localhost:5000/api/login", {
      username: username,
      password: password,
    });

    const { data } = response;
    setStudUser(data.userData);

    // if successful login, forward user to home page
    data.success === false
      ? alert("Username and/or password incorrect.")
      : history.push("/home");

    setIsLoading(false);
  };

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
