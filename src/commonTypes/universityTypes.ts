/**
 * Interfaces relating to Universities
 */

import { Address } from "./addressTypes";
import * as mysql from "mysql";

export interface CampusPicture
{
	pictureID: number,
	universityID: number,
	filename: string,
	picture: mysql.Types.MEDIUM_BLOB,
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
