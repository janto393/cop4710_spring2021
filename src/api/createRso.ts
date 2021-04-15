import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { SqlRso, SqlUniversity } from "src/commonTypes/sqlSchema";

interface CreateRsoInput
{
	name: string,
	universityID: number
}

interface CreateRsoReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

export async function createRso(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: CreateRsoInput = {
		name: request.body.name,
		universityID: request.body.universityID
	};

	let returnPackage: CreateRsoReturn = {
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
		// formulate query to ensure that the university we are trying to add the
		// rso to exists
		let queryString: string = "SELECT * FROM Universities WHERE Universities.ID=" + input.universityID + ";";

		connection.query(queryString, (error: mysql.MysqlError, rows: Array<SqlUniversity>) => {
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

			// formulate query to ensure that there isn't already an rso with the same
			// name at the university selected
			queryString = "SELECT *\nFROM Registered_Student_Organizations\nWHERE ";
			queryString = queryString.concat("Registered_Student_Organizations.name like \'" + input.name + "' ");
			queryString = queryString.concat("AND Registered_Student_Organizations.universityID=" + input.universityID + ";");

			connection.query(queryString, (error: mysql.MysqlError, rows: Array<SqlRso>) => {
				if (error)
				{
					connection.end();
					returnPackage.error = error.toString();
					response.json(returnPackage);
					response.send(500);
					response.send();
					return;
				}

				if (rows.length > 0)
				{
					connection.end();
					returnPackage.error = "RSO already exists with given name";
					response.json(returnPackage);
					response.status(400);
					response.send();
					return;
				}

				// formulate query string to insert the new RSO
				queryString = "INSERT INTO Registered_Student_Organizations (name, universityID, isApproved)\n";
				queryString = queryString.concat("VALUES ('" + input.name + "', " + input.universityID + ", false);")

				// add the rso to the university
				connection.query(queryString, (error: mysql.MysqlError, rows: Array<SqlRso>) => {
					if (error)
					{
						connection.end();
						returnPackage.error = error.toString();
						response.json(returnPackage);
						response.send(500);
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
		returnPackage.error = e.toString();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
