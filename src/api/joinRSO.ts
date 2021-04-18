import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

interface SqlStudent
{
	userID: number,
	universityID: number,
	isApproved: boolean
}

interface EndpointInput
{
	userID: number,
	universityID: number,
	rsoID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function joinRSO(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		userID: request.body.userID,
		universityID: request.body.universityID,
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
		let queryString: string = "SELECT * FROM Students WHERE userID=" + String(input.userID) + " AND universityID=" + String(input.universityID) + ";";

		connection.query(queryString, (error: mysql.MysqlError, rows: SqlStudent[]) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			if ((rows === undefined) || (rows.length < 1))
			{
				connection.end();
				returnPackage.error = "Student is not a part of selected university";
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			let rawData: SqlStudent = rows[0];

			// throw error if student is not approved in the university. Can't join an RSO
			// until approved
			if (!rawData.isApproved)
			{
				connection.end();
				returnPackage.error = "Can't join RSO until student is approved to join university.";
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			// make SQL query to insert the RSO join request in the database
			queryString = "INSERT INTO Member_Groups (userID, rsoID) VALUES (" + String(input.userID) + ", " + String(input.rsoID) + ");";

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
