/**
 * Interfaces related to Users
 */

import * as mysql from "mysql";
import { RSO } from "./rsoTypes";

export interface ProfilePicture
{
	ID: number,
	picture?: string
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
	profilePicture?: ProfilePicture
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
	role: number,
	profilePicture?: ProfilePicture,
	RSOs: RSO[]
}

export interface UserWithoutPassword
{
	userID: number,
	username: string,
	firstname: string,
	lastname: string,
	email: string,
	universityID: number,
	role: number,
	profilePicture?: ProfilePicture,
	RSOs: RSO[]
}
