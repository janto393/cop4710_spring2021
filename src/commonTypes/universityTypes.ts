/**
 * Interfaces relating to Universities
 */

import { Address } from "./addressTypes";

export interface CampusPicture
{
	pictureID: number,
	universityID: number,
	filename: string,
	picture: File,
	position: number
}

export interface University
{
	universityID: number,
	stateID: number,
	name: string,
	address: Address
	description: string,
	phoneNumber: string,
	numStudents: number,
	email: string,
	campusPictures: Array<CampusPicture>
}
