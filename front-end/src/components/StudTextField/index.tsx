import "./index.css"

import { Grid, TextField } from "@material-ui/core";

import React from 'react'

export type StudTextFieldProps = {
	label: string;
	type?: string;
}

const StudTextField: React.FC<StudTextFieldProps>  = (props: StudTextFieldProps) => {
	const { label, type } = props
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
	  )
	}
export default StudTextField