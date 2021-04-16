import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	eventID: number,
	schoolID?: number,
	stateID?: number,
	rsoID?: number,
	meetingType?: number,
	name?: string,
	description?: string,
	address?: string,
	city?: string,
	zip?: string,
	room?: string,
	isPublic?: boolean,
	capacity?: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

function generateQuery(info: EndpointInput): string
{
	let columnNames: Array<string> = [];
	let values: Array<string> = [];

	// process schoolID
	if (info.schoolID !== undefined)
	{
		columnNames.push("schoolID");
		values.push(String(info.schoolID));
	}

	// process stateID
	if (info.stateID !== undefined)
	{
		columnNames.push("stateID");
		values.push(String(info.stateID));
	}

	// process rsoID
	if (info.rsoID !== undefined)
	{
		columnNames.push("rsoID");
		values.push(String(info.rsoID));
	}

	// process meetingType
	if (info.meetingType !== undefined)
	{
		columnNames.push("meetingType");
		values.push(String(info.meetingType));
	}

	// process name
	if (info.name !== undefined)
	{
		columnNames.push("name");
		values.push("'" + info.name + "'");
	}

	// process description
	if (info.description !== undefined)
	{
		columnNames.push("description");
		values.push("'" + info.description + "'");
	}

	// process address
	if (info.address !== undefined)
	{
		columnNames.push("address");
		values.push("'" + info.address + "'");
	}

	// process city
	if (info.city !== undefined)
	{
		columnNames.push("city");
		values.push("'" + info.city + "'");
	}

	// process zip
	if (info.zip !== undefined)
	{
		columnNames.push("zip");
		values.push("'" + info.zip + "'");
	}

	// process room
	if (info.room !== undefined)
	{
		columnNames.push("room");
		values.push("'" + info.room + "'");
	}

	// process isPublic
	if (info.isPublic !== undefined)
	{
		columnNames.push("isPublic");
		values.push(String(info.isPublic));
	}

	// process capacity
	if (info.capacity !== undefined)
	{
		columnNames.push("capacity");
		values.push(String(info.capacity));
	}

	let query: string = "UPDATE Events\nSET\n";

	// generate the column values pairs of the query
	let i: number;
	for (i = 0; i < columnNames.length; i++)
	{
		query = query.concat(columnNames[i] + "=" + values[i]);

		if (i == columnNames.length - 1)
		{
			query = query.concat("\n");
		}
		else
		{
			query = query.concat(",\n");
		}
	}

	// add the where clause to the query with the eventID
	query = query.concat("WHERE ID=" + String(info.eventID) + ";");

	return query;
}

export async function updateEvent(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		eventID: request.body.eventID,
		schoolID: request.body.schoolID,
		stateID: request.body.stateID,
		rsoID: request.body.rsoID,
		meetingType: request.body.meetingType,
		name: request.body.name,
		description: request.body.description,
		address: request.body.address,
		city: request.body.city,
		zip: request.body.zip,
		room: request.body.room,
		isPublic: request.body.isPublic,
		capacity: request.body.capacity
	};

	let returnPackage: EndpointReturn = {
		success: false,
		error: ""
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
		let queryString: string = generateQuery(input);

		connection.query(queryString, (error: mysql.MysqlError, rows: any) => {
			if (error)
			{
				/**
				 * The trigger that ensures that the new capacity being set (if one was
				 * specified) is not lower than the current number of attendees for the
				 * event being updated. If the new value is less than the current
				 * number of attendees, it will set the ID column to null so MySQL
				 * does not update the row.
				 */
				if ((error.errno === 1048) && (error.sqlMessage == "Column 'ID' cannot be null"))
				{
					returnPackage.error = "New Capacity is less than number of attendees";
				}
				else
				{
					returnPackage.error = error;
				}
				

				connection.end();
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
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
