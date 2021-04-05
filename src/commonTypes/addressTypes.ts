export interface Address
{
	address: string,
	city: string,
	state: State,
	zip: string
}

export interface State
{
	stateID: number,
	name: string,
	abbreviation: string
}
