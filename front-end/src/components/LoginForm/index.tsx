import React, { useState } from "react";
import StudForm, { FormFieldType } from "../StudForm";

import { FieldType } from "../../Utils/formUtils";
import { StudUser } from "../../hooks/useStudUser";
import axios from "axios";
import { baseUrl } from "../../Utils/apiUtils";
import produce from "immer";
import { useHistory } from "react-router";

export type LoginFormProps = {
  setStudUser: Function;
  setIsLoading: Function;
};

export type FormInputType = {
  value: string;
  isValid: boolean;
};

const INITIAL_FORM_STATE = {
  email: {
    value: "",
    isValid: null,
  },
  password: {
    value: "",
    isValid: null,
  },
};

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { setStudUser, setIsLoading } = props;
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const history = useHistory();

  const logIn = async () => {
    setIsLoading(true);

    const { email, password } = form;

    // awful design
    localStorage.setItem("email", email.value);
    localStorage.setItem("password", password.value);

    const { data } = await axios.post(`${baseUrl}/login`, {
      username: email.value,
      password: password.value,
    });

    setStudUser(data.userData);

    // if successful login, forward user to home page
    data.success === false
      ? alert("Username and/or password incorrect.")
      : history.push("/home");

    setIsLoading(false);
  };

  const handleChange = (field: string, update: FormInputType) => {
    const updatedForm = produce((form) => {
      form[field] = update;
    });
    setForm(updatedForm);
  };

  const formFields: Array<FormFieldType> = [
    {
      fieldTitle: "email",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "password",
      isPasswordField: true,
      fieldType: FieldType.TEXT_FIELD,
    },
  ];

  return (
    <StudForm
      title="Login"
      formFields={formFields}
      buttonText="Sign in"
      handleClick={logIn}
      handleChange={handleChange}
    />
  );
};

export default LoginForm;
