import { University } from "./dropDownTypes";

export interface Event
{
	ID: number
	schoolID: number,
	address: string,
	city: string,
	state: {
		ID: number,
		name: string,
		acronym: string
	},
	zip: string,
	rso: {
		ID: number,
		name: string
	},
	meetingTypeID: number,
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	capacity: number,
	eventPictures: Array<string>
}

export interface EventFormData extends NewEvent
{
	eventID?: number
}

export interface NewEvent
{
	schoolID: number,
	address: string,
	city: string,
	stateID: number,
	zip: string,
	rsoID: number,
	meetingTypeID: number,
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	capacity: number,
	eventPictures: Array<string>
}
