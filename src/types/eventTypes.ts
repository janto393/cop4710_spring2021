import { University } from "./dropDownTypes";

export interface Event
{
	ID: number
	university: University,
	address: string,
	city: string,
	stateID: string,
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

/**
 * 
 */
export interface NewEvent
{
	schoolID: number,
	address: string,
	city: string,
	stateID: string,
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
