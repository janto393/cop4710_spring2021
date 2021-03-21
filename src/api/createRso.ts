import { Request, Response } from "express";
import * as mysql from "mysql";

// type imports
import { RSO } from "../commonTypes/rsoTypes";

interface CreateRsoInput
{
	name: string,
	universityID: number
}

interface CreateRsoReturn
{
	success: boolean,
	error: string,
	rsoData: RSO
}

export async function createRso(request: Request, response: Response, next: CallableFunction): Promise<void>
{

}
