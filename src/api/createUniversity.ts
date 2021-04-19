import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

interface EndpointInput
{
	name: string,
	address: string,
	city: string,
	stateID: number,
	zip: string,
	description: string,
	phoneNumber: string,
	email: string,
	campusPictures: string[]
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError,
	universityID?: number
}

function makeStringLiteral(s: string): string
{
	return ("'" + s + "'");
}

function generateUniversityQuery(info: EndpointInput): string
{
	let query: string = "INSERT INTO Universities (\n";

	const columns: string[] = [
		"name,\n",
		"address,\n",
		"city,\n",
		"stateID,\n",
		"zip,\n",
		"description,\n",
		"phoneNumber,\n",
		"numStudents,\n",
		"email\n"
	];

	const values: string[] = [
		makeStringLiteral(info.name) + ",\n",
		makeStringLiteral(info.address) + ",\n",
		makeStringLiteral(info.city) + ",\n",
		String(info.stateID) + ",\n",
		makeStringLiteral(info.zip) + ",\n",
		makeStringLiteral(info.description) + ",\n",
		makeStringLiteral(info.phoneNumber) + ",\n",
		String(0) + ",\n",
		makeStringLiteral(info.email) + "\n"
	];

	for (let column of columns)
	{
		query = query.concat(column);
	}

	query = query.concat(")\nVALUES (\n");

	for (let value of values)
	{
		query = query.concat(value);
	}

	query = query.concat(");");

	return query;
}

function generateCampusPicturesQuery(universityID: number, pictures: string[]): string
{
	let query: string = "";

	for (let i: number = 0; i < pictures.length; i++)
	{
		let statement: string = "INSERT INTO Campus_Pictures (universityID, picture, position) VALUES (";
		statement = statement.concat(String(universityID) + ", ");
		statement = statement.concat("'" + pictures[i] + "', ");
		statement = statement.concat(String(i) + "); ");

		query = query.concat(statement);
	}

	return query;
}

export async function createUniversity(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		name: request.body.name,
		address: request.body.address,
		city: request.body.city,
		stateID: request.body.stateID,
		zip: request.body.zip,
		description: request.body.description,
		phoneNumber: request.body.phoneNumber,
		email: request.body.email,
		campusPictures: request.body.campusPictures
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
		let queryString: string = generateUniversityQuery(input);
		
		connection.query(queryString, (error: mysql.MysqlError, result: mysql.OkPacket) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			queryString = generateCampusPicturesQuery(result.insertId, input.campusPictures);

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
		});
	}
	catch (e)
	{
		connection.end();
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
