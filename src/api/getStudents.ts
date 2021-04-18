import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

interface SqlStudent
{
	userID: number,
	firstname: string,
	lastname: string,
	username: string,
	email: string,
	universityID: number,
	universityName: string
}

interface Student
{
	user: {
		ID: number,
		username: string,
		name: string,
		email: string
	},
	university: {
		ID: number,
		name: string
	}
}

interface EndpointInput
{
	universityID: number,
	getApproved: boolean // whether we get approved or unapproved students only
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError,
	students: Student[]
}

function generateQuery(info: EndpointInput): string
{
	let query: string = "SELECT\n";

	const selectFields: string[] = [
		"Users.ID AS userID,\n",
		"Users.firstName AS firstname,\n",
		"Users.lastName AS lastname,\n",
		"Users.username AS username,\n",
		"Users.email AS email,\n",
		"UNI.ID AS universityID,\n",
		"UNI.name AS universityName\n"
	];

	const fromClause: string = "FROM Students AS STU\n";

	const joinStatements: string[] = [
		"INNER JOIN Students AS STU1 ON (STU1.userID=STU.userID AND STU1.universityID=" + String(info.universityID) + " AND STU.isApproved=" + String(info.getApproved) + ")\n",
		"LEFT JOIN Universities AS UNI ON (STU.universityID=UNI.ID)\n",
		"LEFT JOIN Users ON (Users.ID=STU.userID)\n"
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

export async function getStudents(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		universityID: request.body.universityID,
		getApproved: request.body.getApproved
	};

	let returnPackage: EndpointReturn = {
		success: false,
		error: "",
		students: []
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();
	const connection: mysql.Connection = mysql.createConnection(connectionData);
	
	try
	{
		connection.connect();
	}
	catch (e)
	{
		returnPackage.error = e.tostring();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		let queryString: string = generateQuery(input);

		connection.query(queryString, (error: mysql.MysqlError, rows: SqlStudent[]) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			for (let i: number = 0; i < rows.length; i++)
			{
				let rawData: SqlStudent = rows[i];

				let student: Student = {
					user: {
						ID: rawData.userID,
						username: rawData.username,
						name: (rawData.firstname + " " + rawData.lastname),
						email: rawData.email
					},
					university: {
						ID: rawData.universityID,
						name: rawData.universityName
					}
				};

				returnPackage.students.push(student);
			}

			connection.end();
			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
			return;
		});
	}
	catch (e)
	{
		connection.end();
		returnPackage.error = e.tostring();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
