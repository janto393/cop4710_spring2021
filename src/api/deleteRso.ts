import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	rsoID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function deleteRso(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		rsoID: request.body.rsoID
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
		let queryString: string = "DELETE FROM Registered_Student_Organizations WHERE ID=" + String(input.rsoID) + ";";

		// query will fail unless RSO has no existing events
		connection.query(queryString, (error: mysql.MysqlError, rows: Array<any>) => {
			if (error)
			{
				connection.end();

				// if query failed due to existing events by the RSO, send a more specific
				// error message
				if (error.errno === 1451)
				{
					returnPackage.error = "Rso has ongoing events";
				}
				else
				{
					returnPackage.error = error
				}

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
