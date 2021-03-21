import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { UserWithoutPassword } from "../commonTypes/UserTypes";
import { SqlUser } from "src/commonTypes/sqlSchema";

export interface LoginReturnPackage
{
	success: boolean,
	error: string,
	userData: UserWithoutPassword
};

export interface LoginCredentials
{
	username: string,
	password: string
}

export async function login(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let returnPackage: LoginReturnPackage = {
		success: false,
		error: '',
		userData: {
			userID: -1,
			username: '',
			firstname: '',
			lastname: '',
			email: '',
			universityID: -1,
			rsoID: -1,
			role: -1
		}
	};

	// configure mysql connection data
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

	// login data received by client
	const loginData: LoginCredentials = {
		username: request.body.username,
		password: request.body.password
	};

	let queryString: string = "SELECT * FROM Users WHERE Users.username='" + loginData.username + "'";
	queryString = queryString.concat(" AND Users.password='" + loginData.password + "';");

	// query the database for the Users with matching credentials
	try
	{
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

			// return with error if no user was found
			if (rows.length < 1)
			{
				connection.end();
				returnPackage.error = "Username of Password incorrect";
				response.json(returnPackage);
				response.status(400);
				response.send();
				return;
			}

			let userData: SqlUser = JSON.parse(JSON.stringify(rows[0]));

			// transfer query data to returnPackage fields
			returnPackage.userData.userID = userData.ID;
			returnPackage.userData.username = userData.username;
			returnPackage.userData.firstname = userData.firstName;
			returnPackage.userData.lastname = userData.lastName;
			returnPackage.userData.email = userData.email;
			returnPackage.userData.universityID = userData.universityID;
			returnPackage.userData.role = userData.role;
			returnPackage.userData.rsoID = userData.rsoID;

			connection.end();
			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
		});
	}
	catch (e)
	{
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		connection.end();
		return;
	}
}
 