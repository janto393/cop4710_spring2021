import { Request, Response } from "express";
import * as mysql from "mysql";

// util imports
import configureSqlConnection from "../util/configureSqlConnection";

type rsoID = number;
type isApproved = boolean;
type ApprovalArray = Array<[rsoID, isApproved]>;

const RSO_ID_INDEX: number = 0;
const IS_APPROVED_INDEX: number = 1;

interface ParsedRSOs
{
	memberGroupQuery: string, // query to delete member group records so we can delete rso
	rsoQuery: string,
}

interface EndpointInput
{
	RSOs: ApprovalArray
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError
}

function parseRSOs(RSOs: ApprovalArray): ParsedRSOs
{
	let parsedRSOs: ParsedRSOs = {
		memberGroupQuery: "",
		rsoQuery: ""
	}

	let rsoQuery: string = "";
	let memberGroupQuery: string = "";

	for (let rso of RSOs)
	{
		let rsoStatement: string = "";
		let memberGroupStatement: string = "";

		// create an SQL statement to approve the RSO
		if (rso[IS_APPROVED_INDEX])
		{
			rsoStatement = "UPDATE Registered_Student_Organizations\n";
			rsoStatement = rsoStatement.concat("SET isApproved=true\n");
			rsoStatement = rsoStatement.concat("WHERE ID=" + String(rso[RSO_ID_INDEX]) + ";\n\n");
		}

		// create an SQL statement to delete the denied RSO
		else
		{
			rsoStatement = "DELETE FROM Registered_Student_Organizations\n";
			rsoStatement = rsoStatement.concat("WHERE ID=" + String(rso[RSO_ID_INDEX]) + ";\n\n");

			// create SQL statement to delete all members from the denied RSO
			memberGroupStatement = "DELETE FROM Member_Groups WHERE rsoID=" + String(rso[RSO_ID_INDEX]) + ";\n\n";
		}

		rsoQuery = rsoQuery.concat(rsoStatement);
		memberGroupQuery = memberGroupQuery.concat(memberGroupStatement);
	}

	parsedRSOs.rsoQuery = rsoQuery;
	parsedRSOs.memberGroupQuery = memberGroupQuery;

	return parsedRSOs;
}

export async function approveDenyRSOs(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		RSOs: request.body.RSOs
	};

	let returnPackage: EndpointReturn = {
		success: false,
		error: ""
	};

	const connectionData: mysql.ConnectionConfig = configureSqlConnection();
	const connection: mysql.Connection = mysql.createConnection(connectionData);

	let parsedData: ParsedRSOs = parseRSOs(input.RSOs);

	const doRsoQuery = () => {
		connection.query(parsedData.rsoQuery, (error: mysql.MysqlError) => {
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
	};

	/**
	 * Deletes the member groups out of the database. Needs to be externalized to function
	 * because if no RSOs are denied, then we can't make this query since it is empty
	 */
	 const doMemberGroupQuery = () => {
		connection.query(parsedData.memberGroupQuery, (error: mysql.MysqlError) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			doRsoQuery();
		});
	};

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
		if (parsedData.memberGroupQuery === "")
		{
			doRsoQuery();
		}
		else
		{
			doMemberGroupQuery();
		}
	}
	catch (e)
	{
		connection.end();
		returnPackage.error = e.toString;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
