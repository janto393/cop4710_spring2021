import { Request, Response } from "express";
import * as mysql from "mysql";

/**
 * only returns success and error because website will redirect
 * new users to the login menu after registering
 */
export interface RegisterReturnPackage
{
	success: boolean,
	error: string
};

export interface NewUserInfo
{
	username: string,
	password: string,
	firstName: string,
	lastName: string,
	email: string,
	universityID: number,
	rsoID: number,
	role: number
};

export async function register(request: Request, response: Response, next: CallableFunction)
{
	let returnPackage: RegisterReturnPackage = {
		success: false,
		error: ''
	};

	let newUserInfo: NewUserInfo = {
		username: request.body.username,
		password: request.body.password,
		firstName: request.body.firstName,
		lastName: request.body.lastName,
		email: request.body.email,
		universityID: request.body.universityID,
		rsoID: request.body.rsoID,
		role: request.body.role
	};

	// configure mysql connection data
	const connectionData: mysql.ConnectionConfig = {
		host: process.env.RDS_HOSTNAME,
		user: process.env.RDS_USERNAME,
		password: process.env.RDS_PASSWORD,
		port: Number(process.env.RDS_PORT),
		database: "event_manager"
	};

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
		let queryString = "SELECT * FROM Users WHERE Users.username='" + newUserInfo.username + "';";

		// check if username is available
		connection.query(queryString, (error: string, rows: Array<Object>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			// send error if username is already taken
			if (rows.length > 0)
			{
				connection.end();
				returnPackage.error = "Username unavailable";
				response.json(returnPackage);
				response.status(404);
				response.send();
				return;
			}

			// formulate the query string
			queryString = "INSERT INTO Users (";
			queryString = queryString.concat("username, firstName, lastName, password, email, universityID, rsoID, role)\n");
			queryString = queryString.concat("VALUES ('" + newUserInfo.username + "', '" + newUserInfo.firstName + "', '");
			queryString = queryString.concat(newUserInfo.lastName + "', '" + newUserInfo.password + "', '" + newUserInfo.email + "', ");
			queryString = queryString.concat(newUserInfo.universityID + ", " + newUserInfo.rsoID + ", " + newUserInfo.role + ");");

			// insert the new user in the database
			connection.query(queryString, (error: string, rows: Array<Object>) => {
				if (error)
				{
					connection.end();
					returnPackage.error = error;
					response.json(returnPackage);
					response.status(500);
					response.send();
					return;
				}
	
				// create query string to find new user based on info inserted into DB
				queryString = "SELECT * FROM Users WHERE Users.username='" + newUserInfo.username + "';";

				// make sure new user was inserted in to the database
				connection.query(queryString, (error: string, rows: Array<Object>) => {
					if (error)
					{
						connection.end();
						returnPackage.error = error;
						response.json(returnPackage);
						response.status(500);
						response.send();
						return;
					}

					if (rows.length < 1)
					{
						connection.end();
						error = "Failed to register new user";
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
