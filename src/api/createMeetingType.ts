import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { SqlMeetingType } from "../commonTypes/sqlSchema";

interface MeetingType
{
	meetingTypeID: number,
	name: string
}

interface EndpointInput
{
	name: string
}

interface EndpointReturn
{
	success: boolean,
	error: string,
	meetingType: MeetingType
}

export async function createMeetingType(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		name: request.body.name
	};

	let returnPackage: EndpointReturn = {
		success: false,
		error: "",
		meetingType: {
			meetingTypeID: -1,
			name: ""
		}
	};

	// ensure that the input is not an empty string
	if (input.name === "")
	{
		returnPackage.error = "Can't create meeting type with name of empty string";
		response.json(returnPackage);
		response.status(400);
		response.send();
		return;
	}

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
		// formulate query to ensure that the meeting type doesn't already exist
		let queryString: string = "SELECT * FROM Meeting_Types WHERE Meeting_Types.name like '" + input.name + "';";

		connection.query(queryString, (error: string, rows: Array<SqlMeetingType>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error.toString();
				response.json(returnPackage);
				response.send(500);
				response.send();
				return;
			}

			// if the meeting type already exists, just return it
			if (rows.length > 0)
			{
				returnPackage.meetingType.meetingTypeID = rows[0].ID;
				returnPackage.meetingType.name = rows[0].name;
				returnPackage.success = true;

				connection.end();
				response.json(returnPackage);
				response.status(200);
				response.send();
				return;
			}

			// formulate query to create new meeting type
			queryString = "INSERT INTO Meeting_Types (name) VALUES ('" + input.name + "');";

			connection.query(queryString, (error: string, rows: Array<SqlMeetingType>) => {
				if (error)
				{
					connection.end();
					returnPackage.error = error.toString();
					response.json(returnPackage);
					response.send(500);
					response.send();
					return;
				}

				// get the new meeting type info
				queryString = "SELECT * FROM Meeting_Types WHERE Meeting_Types.name like '" + input.name + "';";

				connection.query(queryString, (error: string, rows: Array<SqlMeetingType>) => {
					if (error)
					{
						connection.end();
						returnPackage.error = error.toString();
						response.json(returnPackage);
						response.send(500);
						response.send();
						return;
					}

					if (rows.length < 1)
					{
						connection.end();
						returnPackage.error = "Failed to create meeting type";
						response.json(returnPackage);
						response.status(500);
						response.send();
						return;
					}

					// parse the data of the new meeting type
					returnPackage.meetingType.meetingTypeID = rows[0].ID;
					returnPackage.meetingType.name = rows[0].name;
					returnPackage.success = true;
					response.json(returnPackage);
					response.status(200);
					response.send();
					connection.end();
					return;
				});
			});
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
