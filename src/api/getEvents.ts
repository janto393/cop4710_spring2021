import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

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
	eventComment: string,
	commentTimetag: Date,
	commenterFirstname: string,
	commenterLastname: string
}

interface Comment
{
	author: string,
	timetag: Date,
	comment: string
}

interface Event
{
	schoolID: number,
	address: string,
	city: string,
	state: {
		ID: number,
		name: string,
		acronym: string
	},
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
	comments: Comment[]
}

interface EndpointInput
{
	universityID: number,
	includePrivate: boolean,
	rsoID?: number
}

interface EndpointReturn
{
	success: boolean,
	error: string,
	events: Event[]
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
		"COM.comment AS eventComment,\n",
		"COM.timetag AS commentTimetag,\n",
		"Users.firstName AS commenterFirstname,\n",
		"Users.lastName AS commenterLastname\n"
	];

	const fromStatement: string = "FROM Events\n";

	let conditionalJoin: string;

	if (info.rsoID !== undefined)
	{
		console.log("RSO events");
		// Include private and rso events. If a student is part of an RSO, then it is implied that they are part of the university
		conditionalJoin = "INNER JOIN Events AS E1 ON ((Events.ID=E1.ID) AND (E1.schoolID=" + String(info.universityID) + "))";
	}
	else if (info.includePrivate === true)
	{
		console.log("Private events");
		// the way the if statements are structured, we know to only include private, non-rso events
		conditionalJoin = "INNER JOIN Events AS E1 ON ((Events.ID=E1.ID) AND (E1.schoolID=" + String(info.universityID) + ") AND (E1.rsoID is NULL))";
	}
	else
	{
		console.log("public events");
		// only include public events at the university
		conditionalJoin = "INNER JOIN Events AS E1 ON ((Events.ID=E1.ID) AND (E1.schoolID=" + info.universityID + ") AND (E1.isPublic=true))";
	}

	const joinStatements: Array<string> = [
		conditionalJoin,
		"LEFT JOIN Registered_Student_Organizations AS RSO ON (RSO.ID=Events.rsoID AND RSO.universityID=Events.schoolID)\n",
		"LEFT JOIN Meeting_Types AS MT ON (Events.meetingType=MT.ID)\n",
		"LEFT JOIN States AS ST ON (Events.stateID=ST.ID)\n",
		"LEFT JOIN Comments AS COM ON (Events.ID=COM.eventID)\n", // creates multiple records for the same event for each comment
		"LEFT JOIN Users ON (COM.userID=Users.ID)\n"
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
		universityID: request.body.universityID,
		includePrivate: request.body.includePrivate,
		rsoID: request.body.rsoID
	};

	let returnPackage: EndpointReturn = {
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

		connection.query(queryString, (error: string, rows: Array<SqlEvent>) => {
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
			 * ParsedEvents:
			 *   Set to store all the event IDs that have been parsed. The query in it's
			 *   current form returns a separate record for each event comment record and
			 *   we only want a single record for each event in the return package with
			 *   an array of the comments for the event
			 * 
			 * parsedEventIndexes:
			 *   Hash map to store the indexes of eventIDs in the returnPackage array so we
			 *   can access them when parsing the comments of each event. The key is the
			 *   eventID and the value is the index at which the event is located.
			 */
			let parsedEvents: Set<number> = new Set();
			let parsedEventIndexes: Map<number, number> = new Map();

			// parse all the returned events into the return package
			for (let i: number = 0; i < rows.length; i++)
			{
				let rawData: SqlEvent = rows[i];
				
				// create a new event record if the current event hasn't been seen yet
				if (!parsedEvents.has(rawData.eventID))
				{
					// add the ID to the set of parsed events
					parsedEvents.add(rawData.eventID);

					// store the index at which the event will be stored
					parsedEventIndexes.set(rawData.eventID, returnPackage.events.length);

					let event: Event = {
						schoolID: rawData.schoolID,
						address: rawData.eventAddress,
						city: rawData.eventCity,
						state: {
							ID: rawData.stateID,
							name: rawData.stateName,
							acronym: rawData.stateAcronym
						},
						zip: rawData.eventZip,
						rso: {
							ID: rawData.rsoID,
							name: rawData.rsoName
						},
						meetingType: {
							ID: rawData.meetingTypeID,
							name: rawData.meetingTypeName
						},
						name: rawData.eventName,
						description: rawData.eventDescription,
						room: rawData.eventRoom,
						rating: rawData.eventRating,
						isPublic: rawData.isPublic,
						numAttendees: rawData.numAttendees,
						capacity: rawData.eventCapacity,
						comments: [
							{
								author: (rawData.commenterFirstname + " " + rawData.commenterLastname),
								timetag: new Date(rawData.commentTimetag),
								comment: rawData.eventComment
							}
						]
					};

					returnPackage.events.push(event);
				}

				// we are parsing a comment for an event where the event info has
				// already been parsed
				else
				{
					// get the index of the event
					let eventIndex: number | undefined = parsedEventIndexes.get(rawData.eventID);

					// if the event is undefined (which should be never), an error has occured
					// due to flaws in the API, so just skip the current record
					if (eventIndex === undefined)
					{
						console.warn("Encountered event that was not in parsedEventIndexes set");
						continue;
					}

					let parsedComment: Comment = {
						author: (rawData.commenterFirstname + " " + rawData.commenterLastname),
						timetag: new Date(rawData.commentTimetag),
						comment: rawData.eventComment
					}

					// add the picture to the parsed event
					returnPackage.events[eventIndex].comments.push(parsedComment);
				}
			}

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
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
