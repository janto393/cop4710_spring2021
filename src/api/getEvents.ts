import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	schoolID: number,
	rsoID: number | undefined
}

interface EndpointReturn
{
	success: boolean,
	error: string,
	events: Array<Event>
}

interface SqlEvent
{
	eventID: number,
	schoolID: number,
	rsoID: number,
	rsoName: string,
	meetingTypeID: number,
	meetingTypeName: string,
	eventName: string,
	eventDescription: string,
	eventAddress: string,
	eventCity: string,
	stateID: number,
	stateName: string,
	stateAcronym: string,
	eventZip: string,
	eventRoom: string,
	eventRating: number,
	isPublic: boolean,
	numAttendees: number,
	eventCapacity: number,
	eventPictureID: number,
	eventPicture: mysql.Types.MEDIUM_BLOB
}

interface EventPicture
{
	ID: number,
	picture: mysql.Types.MEDIUM_BLOB,
	position: number
}

interface Event
{
	schoolID: number,
	address: string,
	city: string,
	stateID: number,
	zip: string,
	rso: {
		ID: number,
		name: string
	},
	meetingType: {
		ID: number,
		name: string
	}
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number,
	eventPictures: Array<EventPicture | null>
}

/**
 * creates a query that substitutes all the foreign keys with
 * the actual values from the tables
 */
function createEventQuery(info: EndpointInput): string
{
	const selectFields: Array<string> = [
		"Events.ID AS eventID,\n",
		"Events.schoolID AS schoolID,\n",
		"Events.rsoID AS rsoID,\n",
		"RSO.name AS rsoName,\n",
		"MT.ID AS meetingTypeID,\n",
		"MT.name AS meetingTypeName,\n",
		"Events.name AS eventName,\n",
		"Events.description AS eventDescription,\n",
		"Events.address AS eventAddress,\n",
		"Events.city AS eventCity,\n",
		"ST.ID AS stateID,\n",
		"ST.name AS stateName,\n",
		"ST.acronym AS stateAcronym,\n",
		"Events.zip AS eventZip,\n",
		"Events.room AS eventRoom,\n",
		"Events.rating AS eventRating,\n",
		"Events.isPublic AS isPublic,\n",
		"Events.numAttendees AS numAttendees,\n",
		"Events.capacity AS eventCapacity,\n",
		"EP.ID AS eventPictureID,\n",
		"EP.picture AS eventPicture\n"
	];

	const fromStatement: string = "FROM Events\n";

	const joinStatements: Array<string> = [
		"INNER JOIN Events AS E1 ON (Events.ID=E1.ID AND ((Events.schoolID=" + info.schoolID + " AND Events.rsoID=" + info.rsoID + " AND Events.isPublic=false) OR (Events.schoolID=" + info.schoolID + " AND Events.isPublic=true)))\n",
		"LEFT JOIN Registered_Student_Organizations AS RSO ON (RSO.ID=Events.rsoID AND RSO.universityID=Events.schoolID)\n",
		"LEFT JOIN Event_Pictures AS EP ON (Events.ID=EP.eventID)\n", // creates separate event records for each picture
		"LEFT JOIN Meeting_Types AS MT ON (Events.meetingType=MT.ID)\n",
		"LEFT JOIN States AS ST ON (Events.stateID=ST.ID)\n"
	];

	const orderByStatement: string = "ORDER BY Events.ID ASC;";

	let query: string = "SELECT\n";

	let i: number;
	for (i = 0; i < selectFields.length; i++)
	{
		query = query.concat(selectFields[i]);
	}

	query = query.concat(fromStatement);

	for (i = 0; i < joinStatements.length; i++)
	{
		query = query.concat(joinStatements[i]);
	}

	query = query.concat(orderByStatement);

	return query;
}

export async function getEvents(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		schoolID: request.body.schoolID,
		rsoID: request.body.rsoID
	};

	let returnPackage = {
		success: false,
		error: "",
		events: []
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();
	const connection: mysql.Connection = mysql.createConnection(connectionData);

	try
	{
		connection.connect();
	}
	catch (e)
	{
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		let queryString: string = createEventQuery(input);

		connection.query(queryString, (error: string, rows: Array<SqlEvents>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			/**
			 * Set to store all the event IDs that have been parsed. The query in it's
			 * current form returns a separate record for each event picture record and
			 * we only want a single record for each event in the return package with
			 * an array of the base64 encoded pictures
			 */
			let parsedEvents: Set<number> = new Set();

			// parse all the returned events into the return package
			let i: number;
			for (i = 0; i < rows.length; i++)
			{
				let rawData: SqlEvents = rows[i];
				
				// create a new event record if the current event hasn't been seen yet
				if (!parsedEvents.has(rawData.ID))
				{

				}
			}
		});
	}
	catch (e)
	{
		connection.end();
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
