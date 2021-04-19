import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	commentID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function deleteEventComment(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	const { commentID } = request.body;

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
		returnPackage.error = e.toString();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		let queryString: string = "DELETE FROM Comments WHERE ID=" + commentID + ";";

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
