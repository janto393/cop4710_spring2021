import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	eventID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string
}

export async function deleteEvent(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
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

	/**
	 * We need to delete all the info associated with the event before we
	 * can delete the actual event record
	 */
	try
	{
		let queryString: string = "DELETE FROM Attendees WHERE eventID=" + input.eventID + ";";

		// delete the attendee records of the event
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

			queryString = "DELETE FROM Event_Pictures WHERE eventID=" + input.eventID + ";";

			// delete the event pictures of the event
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

				queryString = "DELETE FROM Events WHERE ID=" + input.eventID + ";";

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

					connection.end();
					returnPackage.success = true;
					response.json(returnPackage);
					response.status(200);
					response.send();
					return;
				});
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
