/**
 * Interfaces related to Users
 */

export interface ProfilePicture
{
	pictureID: number,
	userID: number,
	filename: string,
	picture: File
}

export interface Role
{
	roleID: number,
	name: string,
	level: number
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
	role: number
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
	role: number
}
