export const loginTextFields = [
  { label: "email", type: "email" },
  { label: "password", type: "password" },
];

export const registerTextFields = [
  ...loginTextFields,
  { label: "confirm password", type: "password" },
];
