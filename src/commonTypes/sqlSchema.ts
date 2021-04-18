/**
 * Interfaces to represent the structures of records that are stored in the
 * database
 */
import { Address } from "./addressTypes";
import * as mysql from "mysql";

export interface SqlAttendees
{
	ID: number,
	eventID: number,
	userID: number
}

export interface SqlCampusPictures
{
	ID: number,
	universityID: number,
	filename: string,
	picture: mysql.Types.MEDIUM_BLOB,
	position: number
}

export interface SqlComment
{
	ID: number,
	timeTag: Date,
	comment: string,
	userID: number,
	eventID: number
}

export interface SqlRating
{
	ID: number,
	userID: number,
	eventID: number,
	rating: number,
}

export interface SqlEventPictures
{
	ID: number,
	universityID: number,
	filename: string,
	picture: mysql.Types.MEDIUM_BLOB,
	position: number
}

export interface SqlMeetingType
{
	ID: number,
	name: string
}

export interface SqlMemberGroups
{
	ID: number,
	userID: number,
	rsoID: number
}

export interface SqlProfilePictures
{
	ID: number,
	userID: number,
	picture: mysql.Types.MEDIUM_BLOB
}

export interface SqlRso
{
	ID: number,
	name: string,
	universityID: number
}

export interface SqlRoles
{
	ID: number,
	name: string,
	level: number
}

export interface SqlState
{
	ID: number,
	name: string,
	acronym: string
}

export interface SqlUniversity
{
	universityID: number,
	stateID: number,
	stateName: string,
	stateAcronym: string,
	name: string,
	address: string,
	city: string,
	zip: string,
	description: string,
	phoneNumber: string,
	numStudents: number,
	email: string,
	pictureID: number,
	picture: mysql.Types.MEDIUM_BLOB,
	picturePosition: number
}

export interface SqlUser
{
	ID: number,
	firstName: string,
	lastName: string,
	password: string,
	email: string,
	universityID: number,
	rsoID: number,
	role: number,
	username: string
}
