import {
  ACCOUNT_TYPE_DROPDOWN,
  AccountTypes,
  FieldType,
  UNIVERSITY_DROPDOWN,
  universityIdMap,
} from "../../Utils/formUtils";

import { FormFieldType } from "../../types/formTypes";
import React from "react";
import StudForm from "../StudForm";
import { UserInfoType } from "../../hooks/useStudUser";
import axios from "axios";
import { baseUrl } from "../../Utils/apiUtils";

export type RegisterProps = {
  studUser: UserInfoType;
  setStudUser: Function;
  setIsLoading: Function;
};

const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
  const { studUser, setStudUser, setIsLoading } = props;

  const registerUser = async () => {
    setIsLoading(true);
    // TODO: IMPLEMENT FORM ERROR CHECKING HERE
    const response = await axios.post(`${baseUrl}/register`, {
      ...studUser,
      profilePicture: undefined,
    });

    const { data } = response;

    // temp response alert
    data.success === true
      ? alert("Account successfully created!")
      : alert("Error creating account!");

    setIsLoading(false);
  };

  const selectAccountTypeField: Array<FormFieldType> = [
    {
      fieldTitle: "Select account type",
      fieldType: FieldType.DROP_DOWN,
      selectItems: ACCOUNT_TYPE_DROPDOWN,
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setStudUser({
          ...studUser,
          role: e.target.value === AccountTypes.SUPER_ADMIN ? 2 : 1,
        });
      },
    },
  ];

  const selectUniveristyField: Array<FormFieldType> = [
    {
      fieldTitle: "Select your University",
      fieldType: FieldType.DROP_DOWN,
      selectItems: UNIVERSITY_DROPDOWN,
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({
          ...studUser,
          universityID: universityIdMap.get(e.target.value),
        });
      },
    },
  ];

  const nameEmailPasswordFields: Array<FormFieldType> = [
    {
      fieldTitle: "first name",
      fieldType: FieldType.TEXT_FIELD,
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({ ...studUser, firstname: e.target.value });
      },
    },
    {
      fieldTitle: "last name",
      fieldType: FieldType.TEXT_FIELD,
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({ ...studUser, lastname: e.target.value });
      },
    },
    {
      fieldTitle: "email",
      fieldType: FieldType.TEXT_FIELD,
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
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
      fieldType: FieldType.TEXT_FIELD,
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({ ...studUser, password: e.target.value });
      },
    },
    {
      fieldTitle: "confirm password",
      inputTypePassword: true,
      fieldType: FieldType.TEXT_FIELD,
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        null;
      },
    },
  ];

  const getFormFields = (): Array<FormFieldType> => {
    const formFields: Array<FormFieldType> = [];

    formFields.push(selectAccountTypeField?.[0]);

    formFields.push(selectUniveristyField?.[0]);

    nameEmailPasswordFields.forEach((field: FormFieldType) =>
      formFields.push(field)
    );
    return formFields;
  };

  const getSelectAccountType = (
    <StudForm
      title="Register"
      textFields={getFormFields()}
      buttonText={"Submit"}
      handleClick={registerUser}
    />
  );

  return getSelectAccountType;
};

export default RegisterForm;
