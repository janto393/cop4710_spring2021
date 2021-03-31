// TODO: specify what type of field it is (input, dropdown, etc..)

export const loginTextFields = [
  { label: "email", inputType: "email", fieldType: "textField" },
  { label: "password", inputType: "password", fieldType: "textField" },
];

export const registerTextFields = [
  ...loginTextFields,
  { label: "confirm password", inputType: "password", fieldType: "textField" },
];
