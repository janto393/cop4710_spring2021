/**
 * Interfaces relating to Universities
 */

import { Address } from "./addressTypes";

export interface CampusPicture
{
	ID: number,
	picture: Buffer,
	position: number
}

export interface University
{
	ID: number,
	name: string,
	address: Address
	description: string,
	phoneNumber: string,
	numStudents: number,
	email: string,
	campusPictures: Array<CampusPicture>
}
