import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { NewEvent, NewEventPicture } from "../commonTypes/eventTypes";

interface EndpointReturn
{
	success: boolean,
	error: string
}

function generateNewEventQuery(input: NewEvent): string
{
	let s: string = "INSERT INTO Events (\nschoolID,\nstateID,\nrsoID,\nmeetingType,\nname,\ndescription,\naddress,\ncity,\nzip,\nroom,\nrating,\nisPublic,\nnumAttendees,\ncapacity)\nVALUES (\n";

	// process schoolID
	s = s.concat(input.schoolID + ",\n");

	// process stateID
	s = s.concat(input.stateID + ",\n");

	// process rsoID
	s = s.concat(input.rsoID + ",\n");

	// process meetingType (ID value)
	s = s.concat(input.meetingTypeID + ",\n");

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

function generateEventPictureQuery(pictures: Array<NewEventPicture>, eventID: number): string
{
	const MAX_EVENT_PICTURES: number = 7;
	let query: string = "INSERT INTO Event_Pictures (\neventID,\npicture,\nposition)\nVALUES\n";

	/**
	 * Generate an insertion statement for the maximum number of pictures an
	 * event can have.
	 * 
	 * If there are fewer pictures than the max limit, the records are still
	 * created with an empty blob so they can be modified later
	 */
	let i: number;
	for (i = 0; i < MAX_EVENT_PICTURES; i++)
	{
		let s: string = "("

		// fill in eventID;
		s = s.concat(String(eventID) + ",\n");

		// insert an empty blob if the picture at the specified index is null
		if (pictures[i] === null)
		{
			s = s.concat("'',\n");
		}
		else
		{
			s = s.concat("'" + pictures[i] + "',\n");
		}

		// fill in picture position
		s = s.concat(String(i+1) + "\n");

		s = s.concat(")")

		if (i == MAX_EVENT_PICTURES - 1)
		{
			s = s.concat(";\n");
		}
		else
		{
			s = s.concat(",\n");
		}

		// append the insertion statement to the overall query
		query = query.concat(s);
	}

	return query;
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
		let queryString: string = generateNewEventQuery(input);

		// insert the event into the database
		connection.query(queryString, (error: string, rows: any) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			let newEventID: number = rows.insertId;
			queryString = generateEventPictureQuery(input.eventPictures, newEventID);

			// insert new pictures into the database
			connection.query(queryString, (error: string, rows: any) => {
				if (error)
				{
					connection.end();
					returnPackage.error = error;
					response.json(returnPackage);
					response.status(500);
					response.send();
					return;
				}

				returnPackage.success = true;
				response.json(returnPackage);
				response.status(200);
				response.send();
				return;
			});
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
