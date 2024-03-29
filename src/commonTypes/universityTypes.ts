/**
 * Interfaces relating to Universities
 */

import { Coordinates } from "src/util/fetchCoordinates";
import { Address } from "./addressTypes";

export interface CampusPicture
{
	ID: number,
	picture: string,
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
	campusPictures: CampusPicture[],
	coordinates: Coordinates
}
