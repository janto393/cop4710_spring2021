import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { NewEvent } from "../commonTypes/eventTypes";

interface EndpointReturn
{
	success: boolean,
	error: string
}

export async function createEvent(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let returnPackage: EndpointReturn = {
		success: false,
		error: ""
	};

	let input: NewEvent = {
		schoolID: request.body.schoolID,
		address: request.body.address,
		city: request.body.city,
		stateID: request.body.stateID,
		zip: request.body.zip,
		rsoID: request.body.rsoID,
		meetingTypeID: request.body.meetingTypeID,
		name: request.body.name,
		description: request.body.description,
		room: request.body.room,
		rating: request.body.rating,
		isPublic: request.body.isPublic,
		numAttendees: 0,
		capacity: request.body.capacity,
		eventPictures: request.body.eventPictures
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();
	const connection: mysql.Connection = mysql.createConnection(connectionData);

	try
	{
		connection.connect();
	}
	catch (e)
	{
		returnPackage.error = e.toString();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		// generate query string that inserts the appropriate data in the events table
		let queryString: string = "";

		connection.end();
		returnPackage.success = true;
		response.json(returnPackage);
		response.status(200);
		response.send();
		return;
	}
	catch (e)
	{
		connection.end();
		returnPackage.error = e.toString();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
