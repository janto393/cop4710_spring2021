import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

interface NewEvent
{
	schoolID: number,
	address: string,
	city: string,
	stateID: number,
	zip: string
	rsoID?: number,
	meetingTypeID: number
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number
}

function generateNewEventQuery(input: NewEvent): string
{
	let s: string = "INSERT INTO Events (\nschoolID,\nstateID,\nrsoID,\nmeetingType,\nname,\ndescription,\naddress,\ncity,\nzip,\nroom,\nrating,\nisPublic,\nnumAttendees,\ncapacity)\nVALUES (\n";

	// process schoolID
	s = s.concat(String(input.schoolID) + ",\n");

	// process stateID
	s = s.concat(String(input.stateID) + ",\n");

	// process rsoID
	s = s.concat(((input.rsoID === undefined) ? "null" : String(input.rsoID)) + ",\n");

	// process meetingType (ID value)
	s = s.concat(String(input.meetingTypeID) + ",\n");

	// process event name
	s = s.concat("'" + input.name + "',\n");

	// process event description
	s = s.concat("'" + input.description + "',\n");

	// process address
	s = s.concat("'" + input.address + "',\n");

	// process city
	s = s.concat("'" + input.city + "',\n");

	// process zip
	s = s.concat("'" + input.zip + "',\n");

	// process room
	s = s.concat("'" + input.room + "',\n");

	// process rating
	s = s.concat(String(0) + ",\n");

	// process isPublic
	s = s.concat(String(input.isPublic) + ",\n");

	// process numAttendees
	s = s.concat(String(0) + ",\n");

	// process capacity
	s = s.concat(String(input.capacity) + "\n");

	// complete the query syntax
	s = s.concat(");");

	return s;
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
		capacity: request.body.capacity
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
		let queryString: string = generateNewEventQuery(input);

		// insert the event into the database
		connection.query(queryString, (error: mysql.MysqlError) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			connection.end();
			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
			return;
		});
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
