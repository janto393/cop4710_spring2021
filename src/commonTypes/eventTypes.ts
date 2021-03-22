/**
 * All interfaces related to an Event
 */

import { Address } from "./addressTypes";

export interface Attendee
{
	recordID: number,
	eventID: number,
	userID: number
}

export interface Comment
{
	commentID: number,
	timeTag: Date,
	comment: string,
	userID: number,
	eventID: number
}

export interface EventPicture
{
	pictureID: number,
	universityID: number,
	filename: string,
	picture: File,
	position: number
}

export interface NewEvent
{
	schoolID: number,
	address: string,
	city: string,
	stateID: number,
	zip: string
	rsoID: number,
	meetingTypeID: number
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number,
	eventPictures: Array<EventPicture | null>
}

export interface Event
{
	eventID: number,
	schoolID: number,
	address: Address,
	rsoID: number,
	meetingType: MeetingType,
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number,
	eventPictures: Array<EventPicture | null>
}

export interface MeetingType
{
	meetingTypeID: number,
	name: string
}
