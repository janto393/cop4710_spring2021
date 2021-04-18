import { Request, Response } from "express";
import * as mysql from "mysql";

// type import
import { SqlRating } from "src/commonTypes/sqlSchema";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface newRating
{
	userID: number,
	eventID: number,
	rating: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}


export async function rateEvent(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: newRating = {
		userID: request.body.userID,
		eventID: request.body.eventID,
		rating: request.body.rating
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
		let queryString: string = "SELECT * FROM Ratings WHERE eventID=" + String(input.eventID) + " AND userID=" + String(input.userID) + ";";
		 
		// checking to see if user has all ready rated this event
		connection.query(queryString, (error: string, rows: Array<SqlRating>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			// return if user has already rated the event 
			if (rows.length > 0)
			{
				connection.end();
				returnPackage.error = "User has already rated this event";
				response.json(returnPackage);
				response.status(400);
				response.send();
				return;
			}

			queryString = "INSERT INTO Ratings (eventID, userID, rating) VALUES (" + String(input.eventID) + ", " + String(input.userID) + ", " + String(input.rating) + ");";

			//insert rating into database

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
