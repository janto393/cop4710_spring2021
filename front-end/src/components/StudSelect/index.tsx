import './index.css'

import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core'

import React from 'react'
import { UserInfoType } from '../RegisterForm'

export type StudSelectProps = {
	label: string;
	selectItems: Array<string>;
	registerInfo: UserInfoType;
	setRegisterInfo: Function;
}

const StudSelect: React.FC<StudSelectProps> = (props: StudSelectProps) => {	
	const { label, selectItems, setRegisterInfo, registerInfo } = props

	const handleOnChange = (e: React.ChangeEvent<{value: unknown}>) => {
		setRegisterInfo({
			...registerInfo,
			accountType: e.target.value
		})
	}
	
	return (
		<Grid item xs={12} className="select-field-item">
			<FormControl variant="outlined">
			<InputLabel>{label}</InputLabel>
			
			<Select className="select-field" onChange={handleOnChange}>
				{selectItems.map((item: string) => {
					return (
					<MenuItem value={item}>{item}</MenuItem>
					)
				})}
			</Select>
			</FormControl>
		</Grid>
	)
}

export default StudSelect