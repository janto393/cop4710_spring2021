import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { RSO } from "../commonTypes/rsoTypes";
import { SqlRso } from "../commonTypes/sqlSchema";

interface EndpointInput
{
	rsoID: number | undefined,
	name: string | undefined,
	universityID: number,
}

interface EndpointReturn
{
	success: boolean,
	error: string,
	RSOs: Array<RSO>
}

export async function getRso(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		rsoID: request.body.rsoID,
		name: request.body.name,
		universityID: request.body.universityID
	};

	let returnPackage: EndpointReturn = {
		success: false,
		error: "",
		RSOs: []
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();
	const connection: mysql.Connection = mysql.createConnection(connectionData);

	try
	{
		connection.connect();
	}
	catch (e)
	{
		returnPackage.error = e.toString;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		let queryString: string = "SELECT * FROM Registered_Student_Organizations AS rso WHERE rso.universityID=" + input.universityID;

		if (input.name !== undefined)
		{
			queryString = queryString.concat(" AND rso.name like '" + input.name + "'");
		}

		if (input.rsoID !== undefined)
		{
			queryString = queryString.concat(" AND rso.ID=" + input.rsoID);
		}

		queryString = queryString.concat(";");

		connection.query(queryString, (error: string, rows: Array<SqlRso>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error.toString();
				response.json(returnPackage);
				response.send(500);
				response.send();
				return;
			}
			
			// parse the RSOs from the query
			let i: number;
			for (i = 0; i < rows.length; i++)
			{
				let rawRso: SqlRso = rows[i];
				let parsedRso: RSO = {
					rsoID: rawRso.ID,
					name: rawRso.name,
					universityID: rawRso.universityID
				};

				returnPackage.RSOs.push(parsedRso);
			}

			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
			connection.end();
			return;
		});
	}
	catch (e)
	{
		connection.end();
		returnPackage.error = e.toString;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
