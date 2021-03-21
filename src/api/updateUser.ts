import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { UserWithoutPassword } from "../commonTypes/UserTypes";
import { SqlUser } from "../commonTypes/sqlSchema";

/**
 * Null represents no changes to the field in the database
 */
export interface UpdateInput
{
	firstname: string | undefined,
	lastname: string | undefined,
	password: string | undefined,
	email: string | undefined,
	universityID: number | undefined,
	rsoID: number | undefined,
	role: number | undefined
};

export interface UpdateUserReturnPackage
{
	success: boolean,
	error: string,
	newUserData: UserWithoutPassword
};

export interface ParsedUpdateInfo
{
	userID: number,
	columnNames: Array<string>,
	newValues: Array<string | number>
};

function parseNewInformation(info: UpdateInput, userID: number): ParsedUpdateInfo
{
	let parsedInfo: ParsedUpdateInfo = {
		userID: userID,
		columnNames: [],
		newValues: []
	};

	// parse firstname
	if (info.firstname !== undefined)
	{
		parsedInfo.columnNames.push("Users.firstName");
		parsedInfo.newValues.push("'" + info.firstname + "'");
	}

	// parse lastname
	if (info.lastname !== undefined)
	{
		parsedInfo.columnNames.push("Users.lastName");
		parsedInfo.newValues.push("'" + info.lastname + "'");
	}

	// parse password
	if (info.password !== undefined)
	{
		parsedInfo.columnNames.push("Users.password");
		parsedInfo.newValues.push("'" + info.password + "'");
	}

	// parse email
	if (info.email !== undefined)
	{
		parsedInfo.columnNames.push("Users.email");
		parsedInfo.newValues.push("'" + info.email + "'");
	}

	// parse universityID
	if (info.universityID !== undefined)
	{
		parsedInfo.columnNames.push("Users.universityID");
		parsedInfo.newValues.push(info.universityID);
	}

	// parse rsoID
	if (info.rsoID !== undefined)
	{
		parsedInfo.columnNames.push("Users.rsoID");
		parsedInfo.newValues.push(info.rsoID);
	}

	// parse role
	if (info.role !== undefined)
	{
		parsedInfo.columnNames.push("Users.role");
		parsedInfo.newValues.push(info.role);
	}

	return parsedInfo;
}

function generateUpdateQuery(info: ParsedUpdateInfo): string
{
	let queryString = "UPDATE Users\nSET ";

	// concat all the columns to set
	let i: number;
	for (i = 0; i < info.columnNames.length; i++)
	{
		queryString = queryString.concat(info.columnNames[i] + "=" + info.newValues[i]);

		if (i === info.columnNames.length - 1)
		{
			queryString = queryString.concat("\n");
		}
		else
		{
			queryString = queryString.concat(", ");
		}
	}

	// append the user ID info so we update the right user record
	queryString = queryString.concat("WHERE Users.ID=" + info.userID + ";");

	return queryString;
}

export async function updateUser(request: Request, response: Response, next: CallableFunction)
{
	let returnPackage: UpdateUserReturnPackage = {
		success: false,
		error: '',
		newUserData: {
			userID: -1,
			username: '',
			firstname: '',
			lastname: '',
			email: '',
			universityID: -1,
			rsoID: -1,
			role: -1
		}
	}

	let userID: number = request.body.userID;

	let updateInfo: UpdateInput = {
		firstname: request.body.firstname,
		lastname: request.body.lastname,
		password: request.body.password,
		email: request.body.email,
		universityID: request.body.universityID,
		rsoID: request.body.rsoID,
		role: request.body.role
	};

	let parsedInfo: ParsedUpdateInfo = parseNewInformation(updateInfo, userID);
	let queryString: string = generateUpdateQuery(parsedInfo);

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

	// update the information in the database
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

		// formulate queryString to get user whose information was updated
		queryString = "SELECT * FROM Users WHERE Users.ID=" + parsedInfo.userID;

		// get the new user info
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
			
			let userData: SqlUser = JSON.parse(JSON.stringify(rows[0]));

			// transfer the new user data into the return package
			returnPackage.newUserData.userID = userData.ID;
			returnPackage.newUserData.username = userData.username;
			returnPackage.newUserData.firstname = userData.firstName;
			returnPackage.newUserData.lastname = userData.lastName;
			returnPackage.newUserData.email = userData.email;
			returnPackage.newUserData.universityID = userData.universityID;
			returnPackage.newUserData.rsoID = userData.rsoID;
			returnPackage.newUserData.role = userData.role;

			connection.end();
			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
			return;
		});
	});
}
