import "./index.css";

import { Grid, TextField } from "@material-ui/core";

import React from "react";

export type StudTextFieldProps = {
  label: string;
  inputType?: "password" | "email";
  handleOnChange?: Function;
};

const StudTextField: React.FC<StudTextFieldProps> = (
  props: StudTextFieldProps
) => {
  const { label, inputType: type, handleOnChange = () => null } = props;

  const onChange = (event: any) => {
    handleOnChange(label, {
      value: event.target.value,
      isValid: false,
    });
  };

  return (
    <Grid item xs={12} className="input-field-item">
      <TextField
        variant="outlined"
        color="secondary"
        fullWidth
        className="input"
        label={label}
        type={type}
        onChange={onChange}
      />
    </Grid>
  );
};
export default StudTextField;
