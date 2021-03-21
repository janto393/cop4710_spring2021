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

export interface User
{
	userID: number,
	username: string,
	password: string,
	firstname: string,
	lastname: string,
	email: string,
	universityID: number,
	roleID: number,
	role: number
}
