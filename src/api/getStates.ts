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

export async function getStates(request: Request, response: Response, next: CallableFunction)
{
	let returnPackage: GetStatesReturn = {
		success: false,
		error: "",
		states: []
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();
}
