import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

// EndpointInput
// {
// 	eventID: number,
// 	userID: number,
// 	comment: string
// }

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

function generateInsertQuery(eventID: number, userID: number, comment: string): string
{
	let query: string = "INSERT INTO Comments (eventID, userID, comment, timeTag) VALUES ("
	const date: Date = new Date();
	let parsedMonth: string = String(date.getMonth());
	let parsedDay: string = String(date.getDay());

	// if month is single digit, need to prefix with zero for mysql syntax
	if (date.getMonth() < 10)
	{
		parsedMonth = "0" + String(date.getMonth());
	}

	// if day is single digit, need to prefix with zer for mysql syntax
	if (date.getDay() < 10)
	{
		parsedDay = "0" + String(date.getDay());
	}
	
	query = query.concat(String(eventID) + ", ");
	query = query.concat(String(userID) + ", ");
	query = query.concat(comment + ", ");
	query = query.concat("DATE('" + String(date.getFullYear()) + "-" + parsedMonth + "-" + parsedDay + "')");

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
				response.status(404);
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
