import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

interface State
{
	stateID: number,
	name: string,
	abbreviation: string
}

interface GetStatesReturn
{
	success: boolean,
	error: string,
	states: Array<State>
}

/**
 * structure of the state object in the database
 */
interface SqlState
{
	ID: number,
	name: string,
	acronym: string
}

export async function getStates(request: Request, response: Response, next: CallableFunction)
{
	let returnPackage: GetStatesReturn = {
		success: false,
		error: "",
		states: []
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();

	const connection: mysql.Connection = mysql.createConnection(connectionData);

	try
	{
		connection.connect();
	}
	catch (e)
	{
		returnPackage.error = e.toString;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}

	try
	{
		let queryString: string = "SELECT * FROM States";

		connection.query(queryString, (error: string, rows: Array<SqlState>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error.toString();
				response.json(returnPackage);
				response.send(404);
				response.send();
				return;
			}

			// go through each state record and parse it into the returnPackage
			let i: number;
			for (i = 0; i < rows.length; i++)
			{
				let state: State = {
					stateID: rows[i].ID,
					name: rows[i].name,
					abbreviation: rows[i].acronym
				}

				returnPackage.states.push(state);
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
		returnPackage.error = e.toString;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
