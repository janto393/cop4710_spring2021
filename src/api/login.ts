import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { UserWithoutPassword } from "../commonTypes/UserTypes";
import { RSO } from "../commonTypes/rsoTypes";

interface SqlLoginResult
{
	userID: number,
	username: string,
	firstname: string,
	lastname: string,
	userEmail: string,
	userUniversityID: number,
	userRole: number,
	profilePictureID: number,
	profilePicture: mysql.Types.MEDIUM_BLOB,
	memberGroupID: number,
	rsoID: number,
	rsoName: string,
	rsoUniversityID: number
}

interface LoginReturnPackage
{
	success: boolean,
	error: string,
	userData?: UserWithoutPassword
};

interface LoginCredentials
{
	username: string,
	password: string
}

function generateLoginQuery(username: string, password: string): string
{
	let query: string = "SELECT\n";

	const selectFields: string[] = [
		"Users.ID AS userID,\n",
		"Users.username AS username,\n",
		"Users.firstName AS firstname,\n",
		"Users.lastName AS lastname,\n",
		"Users.email AS userEmail,\n",
		"Users.universityID AS userUniversityID,\n",
		"Users.role AS userRole,\n",
		"PFP.ID AS profilePictureID,\n",
		"PFP.picture AS profilePicture,\n",
		"MG.ID AS memberGroupID,\n",
		"RSO.ID AS rsoID,\n",
		"RSO.name AS rsoName,\n",
		"RSO.universityID AS rsoUniversityID\n"
	];

	const fromClause: string = "FROM Users\n";

	const conditionalJoin: string = "INNER JOIN Users AS U1 ON (U1.ID=Users.ID AND Users.username='" + username + "' AND Users.password='" + password + "')\n";

	const joinStatements: string[] = [
		conditionalJoin,
		"LEFT JOIN Profile_Pictures AS PFP ON (Users.ID=PFP.userID)\n",
		"LEFT JOIN Member_Groups AS MG ON (MG.userID=Users.ID)\n", // creates a separate user record for every RSO they have joined
		"LEFT JOIN Registered_Student_Organizations AS RSO ON (MG.rsoID=RSO.ID)\n"
	];

	for (let i: number = 0; i < selectFields.length; i++)
	{
		query = query.concat(selectFields[i]);
	}

	query = query.concat(fromClause);

	for (let i: number = 0; i < joinStatements.length; i++)
	{
		query = query.concat(joinStatements[i]);
	}

	query = query.concat(";");

	return query;
}

export async function login(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let returnPackage: LoginReturnPackage = {
		success: false,
		error: ''
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

	// login data received by client
	const loginData: LoginCredentials = {
		username: request.body.username,
		password: request.body.password
	};

	try
	{
		let queryString: string = generateLoginQuery(loginData.username, loginData.password);

		// query the database for the Users with matching credentials
		connection.query(queryString, (error: string, rows: Array<SqlLoginResult>) => {
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
			if ((rows === undefined) || (rows.length < 1))
			{
				connection.end();
				returnPackage.error = "Username or Password incorrect";
				response.json(returnPackage);
				response.status(400);
				response.send();
				return;
			}

			for (let i: number = 0; i < rows.length; i++)
			{
				// if this is the first record we're processing, we need to
				// initialize all the user data
				if (i === 0)
				{
					let rawData: SqlLoginResult = rows[i];
					let rso: RSO = {
						ID: rawData.rsoID,
						name: rawData.rsoName,
						universityID: rawData.rsoUniversityID
					};
					let userData: UserWithoutPassword = {
						userID: rawData.userID,
						username: rawData.username,
						firstname: rawData.firstname,
						lastname: rawData.lastname,
						email: rawData.userEmail,
						universityID: rawData.userUniversityID,
						role: rawData.userRole,
						profilePicture: {
							ID: rawData.profilePictureID,
							picture: ((rawData.profilePicture.toString() !== "") ? rawData.profilePicture.toString() : "")
						},
						RSOs: (rso.ID !== null) ? [rso] : undefined
					};

					returnPackage.userData = userData
				}

				// we already logged the user info, we just need to log the additional RSO
				else
				{
					let rawData: SqlLoginResult = rows[i];
					let rso: RSO = {
						ID: rawData.rsoID,
						name: rawData.rsoName,
						universityID: rawData.rsoUniversityID
					};

					if (returnPackage.userData === undefined)
					{
						console.error("Error detected in Login endpoint where user Data is not being stored");
					}
					else
					{
						if ((returnPackage.userData !== undefined) && (returnPackage.userData.RSOs !== undefined))
						{
							returnPackage.userData.RSOs.push(rso);
						}
					}
				}
			}

			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
			return;
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
 