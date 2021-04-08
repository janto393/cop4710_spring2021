import "./index.css";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import React from "react";

export type StudSelectProps = {
  label: string;
  selectItems: Array<string>;
  handleOnChange?: Function;
};

const StudSelect: React.FC<StudSelectProps> = (props: StudSelectProps) => {
  const { label, selectItems, handleOnChange = () => null } = props;

  const onChange = (event: any) => {
    handleOnChange(label, {
      value: event.target.value,
      isValid: false,
    });
  };

  return (
    <Grid item xs={12} className="select-field-item">
      <FormControl variant="outlined">
        <InputLabel>{label}</InputLabel>

        <Select className="select-field" onChange={onChange}>
          {selectItems.map((item: string) => {
            return <MenuItem value={item}>{item}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default StudSelect;
