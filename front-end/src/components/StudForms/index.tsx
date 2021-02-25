import "./index.css";

import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import React from "react";

export type FormFieldType = {
  label: string;
  type: string;
};

export type FormPropsType = {
  title: string;
  textFields: Array<FormFieldType>;
};

const StudForms: React.FC<FormPropsType> = (props: FormPropsType) => {
  const { title, textFields } = props;

  return (
    <Card className="login-card" variant="elevation">
      <CardContent>
        <Grid container direction="row" className="input-field-container">
          {/* form title */}
          <Typography variant="h4" className="form-title">
            {title}
          </Typography>

          {/* maps the list of text fields on the identical textfield component */}
          {textFields.map((field) => {
            const { label, type } = field;

            return (
              <Grid item xs={12} className="input-field-item">
                <TextField
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  className="input"
                  label={label}
                  type={type}
                />
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StudForms;
