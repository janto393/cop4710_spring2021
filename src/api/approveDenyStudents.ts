import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

type UserID = number;
type UniversityID = number;
type IsApproved = boolean;
type StudentApprovalRecord = [UserID, UniversityID, IsApproved];

const USER_ID_INDEX: number = 0;
const UNIVERSITY_ID_INDEX: number = 1;
const IS_APPROVED_INDEX: number = 2;

interface EndpointInput
{
	students: StudentApprovalRecord[]
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

function generateQuery(info: EndpointInput): string
{
	let query: string = "";

	for (let student of info.students)
	{
		let statement: string = "";

		// we are approving a student
		if (student[IS_APPROVED_INDEX])
		{
			// create statement to set the isApproved field in the Students table to true for the student
			statement = "UPDATE Students SET isApproved=true WHERE userID=" + String(student[USER_ID_INDEX]);
			statement = statement.concat(" AND universityID=" + String(student[UNIVERSITY_ID_INDEX]) + ";\n\n")
		}

		// we are denying a student
		else
		{
			statement = "DELETE FROM Students WHERE userID=" + String(student[USER_ID_INDEX]) + " AND universityID=" + String(student[UNIVERSITY_ID_INDEX]) + ";\n\n";
		}

		query = query.concat(statement);
	}

	return query;
}

export async function approveDenyStudents(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		students: request.body.students
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
		returnPackage.error = e.tostring();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		let queryString: string = generateQuery(input);

		connection.query(queryString, (error: mysql.MysqlError) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
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
