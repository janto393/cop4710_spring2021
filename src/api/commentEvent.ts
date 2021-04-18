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



export async function commentEvent(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let timeTag: Date = new Date();

	let input: newComment = {
		comment: request.body.comment,
		userID: request.body.userID,
		eventID: request.body.eventID
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
		let queryString: string = "SELECT * FROM Comments WHERE eventID=" + String(input.eventID) + " AND userID=" + String(input.userID) + ";";
		 
		// checking to see if user has all ready commented on this event
		connection.query(queryString, (error: string, rows: Array<SqlComment>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			// return if user has already commented on the event 
			if (rows.length > 0)
			{
				connection.end();
				returnPackage.error = "User has already commented on this event";
				response.json(returnPackage);
				response.status(400);
				response.send();
				return;
			}

			let parseDate: string = "";
			let parsedMonth: string = "";
			let parsedDay: string = "";

			if (timeTag.getMonth() < 10)
			{
					parsedMonth = "0" + String(timeTag.getMonth());
			}

			// if day is single digit, need to prefix with zer for mysql syntax
			if (timeTag.getDay() < 10)
			{
					parsedDay = "0" + String(timeTag.getDay());
			}
			
			parseDate = parseDate.concat("DATE('" + String(timeTag.getFullYear()) + "-" + parsedMonth + "-" + parsedDay + "')");

			queryString = "INSERT INTO Comments (timeTag, comment, eventID, userID) VALUES (" + parseDate + ", '" + input.comment + "', " + String(input.eventID) + ", " + String(input.userID) + ");";

			//insert comment into database

			connection.query(queryString, (error: mysql.MysqlError, rows: Array<any>) => {
				if (error)
				{
					returnPackage.error = error;

					connection.end();
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