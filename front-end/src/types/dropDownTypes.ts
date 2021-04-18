export interface Address
{
	streetAddress: string,
	city: string,
	state: State,
	zip: string
}

export interface Coordinates
{
	latitude: string,
	longitude: string
}

export interface MeetingType
{
	ID: number,
	name: string
}

export interface RSO
{
	ID: number,
	name: string,
	universityID: number
}

export interface State
{
	ID: number,
	name: string,
	abbreviation: string
}

export interface University
{
	ID: number,
	stateID: number,
	name: string,
	address: Address,
	description: string,
	phoneNumber: string,
	numStudents: number,
	email: string,
	campusPictures: Array<Buffer>,
	coordinates: Coordinates
}
