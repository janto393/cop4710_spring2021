import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { SqlAttendees } from "../commonTypes/sqlSchema";

interface EndpointInput
{
	userID: number,
	eventID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function createAttendee(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		userID: request.body.userID,
		eventID: request.body.eventID
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
		let queryString: string = "SELECT * FROM Attendees WHERE eventID=" + String(input.eventID) + " AND userID=" + String(input.userID) + ";";

		// check to see if user is already attending the selected event
		connection.query(queryString, (error: string, rows: Array<SqlAttendees>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			// return if user is already attending the event (no need to add them)
			if (rows.length > 0)
			{
				connection.end();
				returnPackage.error = "User is already attending event";
				response.json(returnPackage);
				response.status(400);
				response.send();
				return;
			}

			queryString = "INSERT INTO Attendees (eventID, userID) VALUES (" + String(input.eventID) + ", " + String(input.userID) + ");";

			// insert the attendee into the database
			connection.query(queryString, (error: mysql.MysqlError, rows: Array<any>) => {
				if (error)
				{
					/**
					 * Endpoint with "throw" an error if an event is full. The trigger in the
					 * mysql database will set a field to null if there is no room for the new
					 * attendee.
					 */
					if ((error.errno === 1048) && (error.sqlMessage == "Column 'eventID' cannot be null"))
					{
						returnPackage.error = "Event is full"
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
