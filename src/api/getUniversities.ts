import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";
import getLattitudeAndLongitude, { Coordinates } from "../util/fetchCoordinates";

// type imports
import { CampusPicture, University } from "src/commonTypes/universityTypes";
import { SqlUniversity } from "src/commonTypes/sqlSchema";

interface EndpointInput
{
	universityID?: number
}

interface EndpointReturn
{
	success: boolean,
	error: string | mysql.MysqlError,
	universities: University[]
}

/**
 * create a query that substitutes all the foreign keys with
 * the actual values from the tables
 */
function createUniversityQuery(info: EndpointInput): string
{
	const selectFields: Array<string> = [
		"UN.ID AS universityID,\n",
		"ST.ID AS stateID,\n",
		"ST.name AS stateName,\n",
		"ST.acronym AS stateAcronym,\n",
		"UN.name AS name,\n",
		"UN.address AS address,\n",
		"UN.city AS city,\n",
		"UN.zip AS zip,\n",
		"UN.description AS description,\n",
		"UN.phoneNumber AS phoneNumber,\n",
		"UN.numStudents AS numStudents,\n",
		"UN.email AS email,\n",
		"CP.ID as pictureID,\n",
		"CP.picture AS picture,\n",
		"CP.position AS picturePosition\n",
	];

	const fromStatement: string = "FROM Universities AS UN\n";

	// only used when only selecting a specific university
	const optionalJoin: string = "INNER JOIN Universities AS UN1 ON (UN1.ID=" + String(info.universityID) + ")\n";

	const joinStatements: Array<string> = [
		"LEFT JOIN States AS ST ON (ST.ID=UN.stateID)\n",
		"LEFT JOIN Campus_Pictures AS CP ON (CP.universityID=UN.ID)\n"
	];

	const orderByStatement: string = "ORDER BY UN.ID;";

	let query: string = "SELECT\n";

	for (let i: number = 0; i < selectFields.length; i++)
	{
		query = query.concat(selectFields[i]);
	}

	query = query.concat(fromStatement);

	if (info.universityID !== undefined)
	{
		query = query.concat(optionalJoin);
	}

	for (let i: number = 0; i < joinStatements.length; i++)
	{
		query = query.concat(joinStatements[i]);
	}

	query = query.concat(orderByStatement);

	return query;
}

export async function getUniversities(request: Request, response: Response, next: CallableFunction): Promise<void>
{
	let input: EndpointInput = {
		universityID: request.body.universityID
	};

	let returnPackage: EndpointReturn = {
		success: false,
		error: "",
		universities: []
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
		let queryString: string = createUniversityQuery(input);

		connection.query(queryString, async (error: mysql.MysqlError, rows: Array<SqlUniversity>) => {
			if (error)
			{
				connection.end();
				returnPackage.error = error;
				response.json(returnPackage);
				response.status(500);
				response.send();
				return;
			}

			/**
			 * ParsedUniversities:
			 *   Set to store all the universities that have been parsed. The query in
			 *   it's current form returns a separate record for each university picture
			 *   record and we only want a single record for each university in the return
			 *   package with an array of Buffer object containing the picture data
			 * 
			 * parsedUniversityIndexes:
			 *   Hash map to store the indexes of universityIDs in the return Package array
			 *   so we can access them when parsing the pictures of each university. The
			 *   key is the universityID and the value is the index at which the university
			 *   is located
			 */
			let parsedUniversities: Set<number> = new Set();
			let parsedUniversityIndexes: Map<number, number> = new Map();

			for (let i: number = 0; i < rows.length; i++)
			{
				let rawData: SqlUniversity = rows[i];

				// create a new record if the current university hasn't been seen yet
				if (!parsedUniversities.has(rawData.universityID))
				{
					// add the ID to the set of parsed universities
					parsedUniversities.add(rawData.universityID);

					// store the index at which the university will be stored
					parsedUniversityIndexes.set(rawData.universityID, returnPackage.universities.length);

					let picture: CampusPicture = {
						ID: rawData.pictureID,
						picture: rawData.picture.toString(),
						position: rawData.picturePosition
					};

					let university: University = {
						ID: rawData.universityID,
						address: {
							address: rawData.address,
							city: rawData.city,
							state: {
								ID: rawData.stateID,
								name: rawData.stateName,
								abbreviation: rawData.stateAcronym
							},
							zip: rawData.zip
						},
						name: rawData.name,
						description: rawData.description,
						phoneNumber: rawData.phoneNumber,
						numStudents: rawData.numStudents,
						email: rawData.email,
						campusPictures: [picture],
						coordinates: {}
					};

					// fetch the coordinates of the university
					let universityCoordinates: Coordinates = await getLattitudeAndLongitude(university.address.address, university.address.city, university.address.state.name, university.address.zip);
					university.coordinates.latitude = universityCoordinates.latitude;
					university.coordinates.longitude = universityCoordinates.longitude;

					returnPackage.universities.push(university);
				}
				else
				{
					// get the index of the university record
					let universityIndex: number | undefined = parsedUniversityIndexes.get(rawData.universityID);

					// if the university is undefined (which should be never), an error has occured
					// due to flaws in the API, so just skip the current record
					if (universityIndex === undefined)
					{
						continue;
					}

					let picture: CampusPicture = {
						ID: rawData.pictureID,
						picture: rawData.picture.toString(),
						position: rawData.picturePosition
					};

					returnPackage.universities[universityIndex].campusPictures.push(picture);
				}
			}

			connection.end();
			returnPackage.success = true;
			response.json(returnPackage);
			response.status(200);
			response.send();
		});
	}
	catch (e)
	{
		connection.end();
		returnPackage.error = e;
		response.json(returnPackage);
		response.status(500);
		response.send();
		return;
	}
}
