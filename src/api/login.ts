import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

export interface UserData
{
	userID: number,
	username: string,
	firstName: string,
	lastName: string,
	email: string,
	universityID: number,
	rsoID: number,
	role: number
};

export interface LoginReturnPackage
{
	success: boolean,
	error: string,
	userData: UserData
};

export interface LoginCredentials
{
	username: string,
	password: string
}

export async function login(request: Request, response: Response, next: CallableFunction)
{
	let returnPackage: LoginReturnPackage = {
		success: false,
		error: '',
		userData: {
			userID: -1,
			username: '',
			firstName: '',
			lastName: '',
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
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			// return with error if no user was found
			if (rows.length < 1)
			{
				returnPackage.error = "Username of Password incorrect";
				response.json(returnPackage);
				response.status(404);
				response.send();
				return;
			}

			let userData: UserData = JSON.parse(JSON.stringify(rows[0]));

			// transfer query data to returnPackage fields
			returnPackage.userData.userID = userData.userID;
			returnPackage.userData.username = userData.username;
			returnPackage.userData.firstName = userData.firstName;
			returnPackage.userData.lastName = userData.lastName;
			returnPackage.userData.email = userData.email;
			returnPackage.userData.universityID = userData.universityID;
			returnPackage.userData.role = userData.role;
			returnPackage.userData.rsoID = userData.rsoID;

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

	connection.end();
}
