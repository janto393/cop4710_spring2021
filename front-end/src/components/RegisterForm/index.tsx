import React, { useState } from 'react'

import StudForm from '../StudForm'

export type RegisterProps = {}

export type UserInfoType = {
	accountType?: string;
	email?: string;
	university?: string;
}

const INITIAL_VALUE: UserInfoType = {
	accountType: '',
	university: '',
	email:  ''
}

const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
	const [registerStep, setRegisterStep] = useState(1)
	const [registerInfo, setRegisterInfo] = useState<UserInfoType>(INITIAL_VALUE)


	// TODO: connect form submit with api
	const handleSubmitRegistration = () => {
		console.log('user login/create account!')
	}

	const getSelectAccountType = (
			<StudForm
				title="Select Account Type"
				textFields={[
					{label: 'Account', 
					fieldType: "dropDown", 
					selectItems: ['University', 'Student']}
				]}
				buttonText="Next"
				registerInfo={registerInfo}
				setRegisterInfo={setRegisterInfo}
				step={registerStep}
				handleClick={() => 
					registerInfo.accountType === 'Student' 
					?  setRegisterStep(registerStep + 2) 
					: setRegisterStep(registerStep + 1)
				}
			/>
		)
	

	const getUniversityDetails = (
			<StudForm
				title="University Details"
				textFields={[
					{label: 'University', 
					fieldType: "dropDown", 
					selectItems: [
						'University of Central Florida', 
						'University of Florida', 
						'Florida State University'
					]}
				]}
				buttonText="Next"
				registerInfo={registerInfo}
				setRegisterInfo={setRegisterInfo}
				step={registerStep}
				handleClick={() => setRegisterStep(registerStep + 1)}
				handleBackClick={() => setRegisterStep(registerStep - 1)}
			/>
	)
	

	const getRegisterAccount = (
			<StudForm
				title="Register"
				textFields={[
				{label: 'email', fieldType: 'textField'},
				{label: 'password', inputType: 'password', fieldType: 'textField'},
				{label: 'confirm password', inputType: 'password', fieldType: 'textField'}
				]}
				buttonText="Submit"
				registerInfo={registerInfo}
				setRegisterInfo={setRegisterInfo}
				step={registerStep}
				handleBackClick={() => 
					registerInfo.accountType === 'Student' 
					? setRegisterStep(registerStep - 2)
					: setRegisterStep(registerStep - 1)
				}
				handleClick={handleSubmitRegistration}
			/>
		)
	

	const getForm = () => {
		switch(registerStep) {
			case 1:
				return getSelectAccountType
			case 2:
				return getUniversityDetails
			case 3:
				return getRegisterAccount
			default:
				return null
		}
	}

	return getForm()
}

export default RegisterForm