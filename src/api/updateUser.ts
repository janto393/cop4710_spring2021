import { Request, Response } from "express";
import * as mysql from "mysql";

/**
 * Null represents no changes to the field in the database
 */
export interface NewUserInfo
{
	firstName: string | null,
	lastName: string | null,
	email: string | null,
	universityID: number | null,
	rsoID: number | null,
	role: number | null
};

export interface UpdateUserReturnPackage
{
	success: boolean,
	error: string,
	newUserData: {
		userID: number,
		username: string,
		firstName: string,
		lastName: string,
		email: string,
		universityID: number,
		rsoID: number,
		role: number
	}
};

export async function updateUser(request: Request, response: Response, next: CallableFunction)
{
	let returnPackage: UpdateUserReturnPackage = {
		success: false,
		error: '',
		newUserData: {
			userID: -1,
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			universityID: -1,
			rsoID: -1,
			role: -1
		}
	}

	let updateInfo: NewUserInfo = {
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

	// TODO: insert logic to identify what fields need to be updated
}
