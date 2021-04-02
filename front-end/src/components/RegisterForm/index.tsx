import React, { useEffect } from 'react'
import StudForm, { FormFieldType } from '../StudForm'

import { UserInfoType } from '../../hooks/useRegister'

export type RegisterProps = {
	registerInfo: UserInfoType;
	setRegisterInfo: Function;
	registerUser: Function;
}


const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
	const { registerInfo, setRegisterInfo, registerUser } = props
	const buttonText = 'Submit'

	// when we change account type we want to reset university
	useEffect(() => {
		registerInfo.role === 'Student' ? setRegisterInfo({
			...registerInfo,
			university: ''
		}) : null 
	}, [registerInfo.role])

	const selectAccountTypeField: Array<FormFieldType> = [
		{label: 'Select account type', 
		fieldType: "dropDown", 
		selectItems: ['University (Super admin)', 'Student'],
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
				setRegisterInfo({
					...registerInfo,
					role: e.target.value === 'University (Super admin)' ? 1 : 2
				})
			}
		}
	]
	
	const selectUniveristyField = [
		{label: 'Select your University', 
		fieldType: "dropDown", 
		selectItems: [
		'University of Central Florida', 
		'University of Florida', 
		'Florida State University'],
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
			setRegisterInfo({
				...registerInfo,
				universityID: e.target.value
			})
		}}
	]
	
	const emailPasswordFields = [
		{label: 'first name', 
		fieldType: 'textField', 
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
			setRegisterInfo({...registerInfo, firstName: e.target.value})}
		},{label: 'last name', 
		fieldType: 'textField', 
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
			setRegisterInfo({...registerInfo, lastName: e.target.value})}
		},
		{label: 'email', 
		fieldType: 'textField', 
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
			setRegisterInfo({...registerInfo, email: e.target.value, userName: e.target.value})}
		},
		{label: 'password', 
		inputType: 'password', 
		fieldType: 'textField', 
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
			setRegisterInfo({...registerInfo, password: e.target.value})}
		},
		{label: 'confirm password', 
		inputType: 'password', 
		fieldType: 'textField', 
		handleOnChange: (e: React.ChangeEvent<{value: unknown}>) => {
			setRegisterInfo({...registerInfo, rePassword: e.target.value})}}
	]


	const getFormFields = (): Array<FormFieldType> =>  {
		const formFields: Array<FormFieldType> = []

		formFields.push(selectAccountTypeField?.[0]);

		formFields.push(selectUniveristyField?.[0]);
		
		emailPasswordFields.forEach((field: FormFieldType) => formFields.push(field))
		return formFields
	}

	const getSelectAccountType = (
			<StudForm
				title="Register"
				textFields={getFormFields()}
				registerInfo={registerInfo}
				setRegisterInfo={setRegisterInfo}
				buttonText={buttonText}
				handleClick={registerUser}
			/>
		)


	return getSelectAccountType
}

export default RegisterForm