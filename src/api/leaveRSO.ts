import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	userID: number,
	rsoID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function leaveRSO(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		userID: request.body.userID,
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
		// first check if student is a part of the university
		let queryString: string = "DELETE FROM Member_Groups WHERE userID=" + String(input.userID) + " AND rsoID=" + String(input.rsoID) + ";";

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
