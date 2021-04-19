import { Coordinates, University } from "./dropDownTypes";

export interface Comment
{
	ID: number,
	author: string,
	timetag: Date,
	comment: string
}

export interface Event
{
	ID: number,
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
	meetingType: {
		ID: number,
		name: string
	},
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number,
	coordinates: Coordinates,
	comments: Comment[]
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
	eventPictures: Array<Buffer>
}
