import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { RSO } from "../commonTypes/rsoTypes";
import { SqlUniversity } from "src/commonTypes/sqlSchema";

interface CreateRsoInput
{
	name: string,
	universityID: number
}

interface CreateRsoReturn
{
	success: boolean,
	error: string,
	rsoData: RSO
}

export async function createRso(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: CreateRsoInput = {
		name: request.body.name,
		universityID: request.body.universityID
	};

	let returnPackage: CreateRsoReturn = {
		success: false,
		error: "",
		rsoData: {
			rsoID: -1,
			name: "",
			universityID: -1
		}
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
		// formulate query to ensure that the university we are trying to add the
		// rso to exists
		let queryString: string = "SELECT * FROM Universities WHERE Universities.ID=" + input.universityID + ";";

		connection.query(queryString, (error: string, rows: Array<SqlUniversity>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error.toString();
				response.json(returnPackage);
				response.send(500);
				response.send();
				return;
			}

			// make sure the university exists
			if (rows.length < 1)
			{
				connection.end();
				returnPackage.error = "University selected does not exist";
				response.json(returnPackage);
				response.status(400);
				response.send();
				return;
			}
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
