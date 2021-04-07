import React, { useEffect } from "react";

import { FormFieldType } from "../../types/formTypes";
import StudForm from "../StudForm";
import { UserInfoType } from "../../hooks/useStudUser";
import axios from "axios";

export type RegisterProps = {
  studUser: UserInfoType;
  setStudUser: Function;
  setIsLoading: Function;
};

const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
  const { studUser, setStudUser, setIsLoading } = props;
  const buttonText = "Submit";

  const universityIdMap = new Map<string, number>();
  universityIdMap.set("University of Central Florida", 1);
  universityIdMap.set("University of Florida", 2);
  universityIdMap.set("Florida State University", 3);

  const registerUser = async () => {
    setIsLoading(true);

    // TODO: IMPLEMENT FORM ERROR CHECKING HERE
    // call to regiser account
    const response = await axios.post("http://localhost:5000/api/register", {
      ...studUser,
      profilePicture: undefined,
    });

    const { data } = response;

    console.log(data);

    // temp response alert
    data.success === true
      ? alert("Account successfully created!")
      : alert("Error creating account!");

    setIsLoading(false);
  };

  const selectAccountTypeField: Array<FormFieldType> = [
    {
      fieldTitle: "Select account type",
      fieldType: "dropDown",
      selectItems: ["University (Super admin)", "Student"],
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setStudUser({
          ...studUser,
          role: e.target.value === "University (Super admin)" ? 2 : 1,
        });
      },
    },
  ];

  const selectUniveristyField: Array<FormFieldType> = [
    {
      fieldTitle: "Select your University",
      fieldType: "dropDown",
      selectItems: [
        "University of Central Florida",
        "University of Florida",
        "Florida State University",
      ],
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
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({ ...studUser, firstname: e.target.value });
      },
    },
    {
      fieldTitle: "last name",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({ ...studUser, lastname: e.target.value });
      },
    },
    {
      fieldTitle: "email",
      fieldType: "textField",
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
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        setStudUser({ ...studUser, password: e.target.value });
      },
    },
    {
      fieldTitle: "confirm password",
      inputTypePassword: true,
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: string }>) => {
        null;
      },
    },
  ];

  /*
	- each array above is full individual formFields
	- this fn maps through each of the arrays above
    and pushes the individual fields inside the comprehensive
    formFields array and returns that to our studForm

	- our studForm will know how to render each field to the screen
	in sequence

  - we seperated them in individual related arrays incase we wanted some form fields
   to appear only after a dropdown selection. Modularity scales well
  */
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
      buttonText={buttonText}
      handleClick={registerUser}
    />
  );

  return getSelectAccountType;
};

export default RegisterForm;
