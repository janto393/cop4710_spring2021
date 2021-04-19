import { Request, Response } from "express";
import * as mysql from "mysql";

// type import
import { SqlComment } from "src/commonTypes/sqlSchema";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface newComment
{
	comment: string,
	userID: number,
	eventID: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

function generateInsertQuery(eventID: number, userID: number, comment: string): string
{
	let query: string = "INSERT INTO Comments (eventID, userID, comment, timeTag) VALUES ("
	const date: Date = new Date();
	const ISO_CUTOFF_INDEX: number = 10; // date extraction index from the date/time string
	let dateString: string = date.toISOString().substring(0, ISO_CUTOFF_INDEX);
	
	query = query.concat(String(eventID) + ", ");
	query = query.concat(String(userID) + ", ");
	query = query.concat("'" + comment + "', ");
	query = query.concat("DATE('" + dateString + "')");

	query = query.concat(");");

	return query;
}


export async function createEventComment(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	const {eventID, userID, comment} = request.body;

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
		let queryString: string = generateInsertQuery(eventID, userID, comment);

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
