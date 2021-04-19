import {
  ACCOUNT_TYPE_DROPDOWN,
  FieldType,
  UNIVERSITY_DROPDOWN,
  formMap,
  universityIdMap,
} from "../../Utils/formUtils";
import React, { useState } from "react";
import StudForm, { FormFieldType } from "../StudForm";

import { FormInputType } from "../LoginForm";
import { StudUser } from "../../hooks/useStudUser";
import axios from "axios";
import { baseUrl } from "../../Utils/apiUtils";
import produce from "immer";
import { useHistory } from "react-router";
import { useLoadingUpdate } from "src/Context/LoadingProvider";

export type RegisterProps = {
  setStudUser: Function;
};

const INITIAL_FORM_STATE = {
  accountType: {
    value: "",
    isValid: null,
  },
  university: {
    value: "",
    isValid: null,
  },
  firstname: {
    value: "",
    isValid: null,
  },
  lastname: {
    value: "",
    isValid: null,
  },
  email: {
    value: "",
    isValid: null,
  },
  password: {
    value: "",
    isValid: null,
  },
  confirmPassword: {
    value: "",
    isValid: null,
  },
};

const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const history = useHistory();
  const setIsLoading = useLoadingUpdate();

  const registerUser = async () => {
    setIsLoading(true);

    const {
      accountType,
      university,
      firstname,
      lastname,
      email,
      password,
    } = form;

    const { data } = await axios.post(`${baseUrl}/register`, {
      username: email.value,
      password: password.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      universityID: universityIdMap.get(university.value),
      role: accountType.value === "Student" ? 1 : 1,
    });

    // temp response alert
    data.success === true
      ? history.push("/home")
      : alert("Error creating account!");

    setIsLoading(false);
  };

  const handleChange = (field: string, update: FormInputType) => {
    const mappedField: any = formMap.get(field);

    const updatedForm = produce((form) => {
      form[mappedField] = update;
    });
    setForm(updatedForm);
  };

  const formFields: Array<FormFieldType> = [
    {
      fieldTitle: "Select account type",
      fieldType: FieldType.DROP_DOWN,
      selectItems: ACCOUNT_TYPE_DROPDOWN,
    },
    {
      fieldTitle: "Select your University",
      fieldType: FieldType.DROP_DOWN,
      selectItems: UNIVERSITY_DROPDOWN,
    },
    {
      fieldTitle: "First name",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Last name",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Email",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Password",
      isPasswordField: true,
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Confirm password",
      isPasswordField: true,
      fieldType: FieldType.TEXT_FIELD,
    },
  ];

  const superAdminFormFields: Array<FormFieldType> = [
    {
      fieldTitle: "Select account type",
      fieldType: FieldType.DROP_DOWN,
      selectItems: ACCOUNT_TYPE_DROPDOWN,
    },
    {
      fieldTitle: "University name",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Address",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "City",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "State ID",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Zip code",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Description",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Phone number",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Email",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Campus pictures",
      fieldType: FieldType.IMAGE_UPLOAD,
    },
    {
      fieldTitle: "First name",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Last name",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Email",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Password",
      isPasswordField: true,
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Confirm password",
      isPasswordField: true,
      fieldType: FieldType.TEXT_FIELD,
    },
  ];

  const getSelectAccountType = (
    <StudForm
      title="Register"
      formFields={
        form.accountType.value === "Super Admin"
          ? superAdminFormFields
          : formFields
      }
      buttonText={"Submit"}
      handleClick={registerUser}
      handleChange={handleChange}
    />
  );

  return getSelectAccountType;
};

export default RegisterForm;
