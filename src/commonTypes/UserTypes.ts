/**
 * Interfaces related to Users
 */

import * as mysql from "mysql";

export interface ProfilePicture
{
	pictureID: number,
	userID: number,
	picture: mysql.Types.MEDIUM_BLOB
}

export interface Role
{
	roleID: number,
	name: string,
	level: number
}

export interface NewUser
{
	username: string,
	password: string,
	firstname: string,
	lastname: string,
	email: string,
	universityID: number,
	role: number,
	profilePicture: ProfilePicture | undefined
}

export interface UserWithPassword
{
	userID: number,
	username: string,
	password: string,
	firstname: string,
	lastname: string,
	email: string,
	universityID: number,
	rsoID: number,
	role: number,
	profilePicture: ProfilePicture | undefined
}

export interface UserWithoutPassword
{
	userID: number,
	username: string,
	firstname: string,
	lastname: string,
	email: string,
	universityID: number,
	rsoID: number,
	role: number,
	profilePicture: ProfilePicture | undefined
}
