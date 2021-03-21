/**
 * Interfaces related to states
 */

export interface Address
{
	address: string,
	city: string,
	state: State,
	zip: string
}

export interface State
{
	statID: number,
	name: string,
	abbreviation: string
}
