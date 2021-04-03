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

interface EndpointReturn
{
	success: boolean,
	error: string,
	meetingTypes: Array<MeetingType>
}

export async function getMeetingTypes(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let returnPackage: EndpointReturn = {
		success: false,
		error: "",
		meetingTypes: []
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
		let queryString = "SELECT * FROM Meeting_Types ORDER BY Meeting_Types.name ASC";

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

			// parse each meeting type into the return package
			let i: number;
			for (i = 0; i < rows.length; i++)
			{
				let rawData: SqlMeetingType = rows[i];
				let parsedData: MeetingType = {
					meetingTypeID: rawData.ID,
					name: rawData.name
				};

				returnPackage.meetingTypes.push(parsedData);
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
		returnPackage.error = e.toString;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
