import React, { useEffect } from "react";
import StudForm, { FormFieldType } from "../StudForm";

import { UserInfoType } from "../../hooks/useRegister";

export type RegisterProps = {
  registerInfo: UserInfoType;
  setRegisterInfo: Function;
  registerUser: Function;
};

const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
  const { registerInfo, setRegisterInfo, registerUser } = props;
  const buttonText = "Submit";

  // when we change account type we want to reset universityID
  useEffect(() => {
    setRegisterInfo({
      ...registerInfo,
      universityID:
        registerInfo.role === "Student" ? "" : registerInfo.universityID,
    });
  }, [registerInfo.role]);

  const selectAccountTypeField: Array<FormFieldType> = [
    {
      label: "Select account type",
      fieldType: "dropDown",
      selectItems: ["University (Super admin)", "Student"],
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({
          ...registerInfo,
          role: e.target.value === "University (Super admin)" ? 1 : 2,
        });
      },
    },
  ];

  const selectUniveristyField: Array<FormFieldType> = [
    {
      label: "Select your University",
      fieldType: "dropDown",
      selectItems: [
        "University of Central Florida",
        "University of Florida",
        "Florida State University",
      ],
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({
          ...registerInfo,
          universityID: e.target.value,
        });
      },
    },
  ];

  const nameEmailPasswordFields: Array<FormFieldType> = [
    {
      label: "first name",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({ ...registerInfo, firstname: e.target.value });
      },
    },
    {
      label: "last name",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({ ...registerInfo, lastname: e.target.value });
      },
    },
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
    {
      label: "confirm password",
      inputType: "password",
      fieldType: "textField",
      handleOnChange: (e: React.ChangeEvent<{ value: unknown }>) => {
        setRegisterInfo({ ...registerInfo, rePassword: e.target.value });
      },
    },
  ];

  /*
	- each array above is full of formFields
	this fn maps through each of the arrays above
	and pushes the individual fields inside the comprehensive
	formFields array and returns that to our studForm

	- our studForm will know how to render each field to the screen
	in sequence
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
      registerInfo={registerInfo}
      setRegisterInfo={setRegisterInfo}
      buttonText={buttonText}
      handleClick={registerUser}
    />
  );

  return getSelectAccountType;
};

export default RegisterForm;
