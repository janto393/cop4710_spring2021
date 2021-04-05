/**
 * Interfaces relating to Universities
 */

import { Address } from "./addressTypes";
import { State } from "./addressTypes";
import * as mysql from "mysql";

export interface CampusPicture
{
	ID: number,
	picture: Buffer,
	position: number
}

export interface University
{
	universityID: number,
	name: string,
	address: Address
	description: string,
	phoneNumber: string,
	numStudents: number,
	email: string,
	campusPictures: Array<CampusPicture>
}
