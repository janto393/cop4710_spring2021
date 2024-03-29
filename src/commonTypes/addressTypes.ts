export interface Address
{
	address: string,
	city: string,
	state: State,
	zip: string
}

export interface State
{
	ID: number,
	name: string,
	abbreviation: string
}
