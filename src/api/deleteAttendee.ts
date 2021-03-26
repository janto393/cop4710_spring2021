import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	userID: number,
	eventID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string
}

export async function deleteAttendee(request: Request, response: Response, next: CallableFunction): Promise<void>
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
		let queryString: string = "DELETE FROM Attendees WHERE userID=" + String(input.userID) + " AND eventID=" + String(input.eventID) + ";";

		connection.query(queryString, (error: string, rows: Array<any>) => {
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
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
