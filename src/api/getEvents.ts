import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";
let nodeGeocoder = require('node-geocoder');
let options = {
	provider: 'openstreetmap'
};

let geoCoder = nodeGeocoder(options);


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
	eventPicture: mysql.Types.MEDIUM_BLOB,
	eventPicturePosition: number,
	schoolName: string,
	schoolAddress: string,
	schoolCity: string,
	schoolZip: string,
	schoolDescription: string,
	schoolPhonenumber: string,
	schoolNumStudents: number,
	schoolEmail: string,
	schoolStateID: number,
	schoolStateName: string,
	schoolStateAcronym: string
}

interface EventPicture
{
	ID: number,
	picture: mysql.Types.MEDIUM_BLOB,
	position: number
}

interface Event
{
	schoolID: {
		ID: number,
		state: {
			ID: number,
			name: string,
			acronym: string
		},
		name: string,
		address: string,
		city: string,
		zip: string,
		description: string,
		// not sure what to make phone number
		phonenumber: string,
		numStudents: number,
		email: string
	},
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
	eventPictures: Array<EventPicture>,
	eventLat: number,			 	// find this
	eventLong: number, 		 	// find this 
	schoolLat: number, 			// find this
	schoolLong: number 			// find this
}

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

// used to get the lattitude from an address 
async function getlat(location: string): Promise<number>
{
	let lattitude: number = (await geoCoder.geocode('location')).lattitude;
	return lattitude;
}

// used to get the longitude from an address
async function getlong(location: string): Promise<number>
{
	let longitude: number = (await geoCoder.geocode('location')).longitude;
	return longitude;
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
		"EP.picture AS eventPicture,\n",
		"EP.position AS eventPicturePosition\n"
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

		connection.query(queryString, async (error: string, rows: Array<SqlEvent>): Promise<void> => {
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
			 *   current form returns a separate record for each event picture record and
			 *   we only want a single record for each event in the return package with
			 *   an array of the base64 encoded pictures
			 * 
			 * parsedEventIndexes:
			 *   Hash map to store the indexes of eventIDs in the returnPackage array so we
			 *   can access them when parsing the pictures of each event. The key is the
			 *   eventID and the value is the index at which the event is located.
			 */
			let parsedEvents: Set<number> = new Set();
			let parsedEventIndexes: Map<number, number> = new Map();

			// parse all the returned events into the return package
			let i: number;
			for (i = 0; i < rows.length; i++)
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
						schoolID: {
							ID: rawData.schoolID,
							state: {
								ID: rawData.schoolStateID,
								name: rawData.schoolStateName,
								acronym: rawData.schoolStateAcronym
							},
							name: rawData.schoolName,
							address: rawData.schoolAddress,
							city: rawData.schoolCity,
							zip: rawData.schoolZip,
							description: rawData.schoolDescription,
							phonenumber: rawData.schoolPhonenumber,
							numStudents: rawData.schoolNumStudents,
							email: rawData.schoolEmail
						},
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
						eventPictures: [
							{
								ID: rawData.eventPictureID,
								picture: rawData.eventPicture,
								position: rawData.eventPicturePosition
							}
						],
						// concating strings to be in the form of address, city, state zip code ex:
						// 4000 central Florida Blvd, Orlando, FL 32816 
						eventLat: await getlat(String(rawData.eventAddress) + String(rawData.eventCity) + String(rawData.stateName) + String(rawData.eventZip)),
						eventLong: await getlong(String(rawData.eventAddress) + String(rawData.eventCity) + String(rawData.stateName) + String(rawData.eventZip)),
						schoolLat: await getlat(String(rawData.schoolAddress) + String(rawData.schoolCity) + String(rawData.schoolStateName) + String(rawData.schoolZip)),
						schoolLong: await getlong(String(rawData.schoolAddress) + String(rawData.schoolCity) + String(rawData.schoolStateName) + String(rawData.schoolZip))
					};
					
					returnPackage.events.push(event);
				}

				// we are parsing a picture for an event where the event info has
				// already been parsed
				else
				{
					// get the index of the event
					let eventIndex: number | undefined = parsedEventIndexes.get(rawData.eventID);

					// if the event is undefined (which should be never), an error has occured
					// due to flaws in the API, so just skip the current record
					if (eventIndex === undefined)
					{
						continue;
					}

					let parsedPicture: EventPicture = {
						ID: rawData.eventPictureID,
						picture: rawData.eventPicture,
						position: rawData.eventPicturePosition
					};

					// add the picture to the parsed event
					returnPackage.events[eventIndex].eventPictures.push(parsedPicture);
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
