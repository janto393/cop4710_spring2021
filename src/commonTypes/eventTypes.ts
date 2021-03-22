/**
 * All interfaces related to an Event
 */

import { Address } from "./addressTypes";
import * as mysql from "mysql";

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
	picture: mysql.Types.MEDIUM_BLOB,
	position: number
}

export interface Event
{
	eventID: number,
	schoolID: number,
	address: Address,
	stateID: number,
	rsoID: number,
	meetingType: MeetingType,
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number
}

export interface MeetingType
{
	meetingTypeID: number,
	name: string
}
