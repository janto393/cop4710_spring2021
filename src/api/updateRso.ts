import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	rsoID: number,
	name: string
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function updateRso(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		rsoID: request.body.rsoID,
		name: request.body.name
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
		let queryString: string = "UPDATE Registered_Student_Organizations SET name='" + input.name + "' WHERE ID=" + String(input.rsoID) + ";";

		connection.query(queryString, (error: mysql.MysqlError, rows: Array<any>) => {
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
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
