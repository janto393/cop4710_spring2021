import { Request, Response } from "express";
import * as mysql from "mysql";

// utility imports
import configureSqlConnection from "../util/configureSqlConnection";

// type imports
import { NewUser } from "../commonTypes/UserTypes";
import { SqlUser } from "src/commonTypes/sqlSchema";

/**
 * only returns success and error because website will redirect
 * new users to the login menu after registering
 */
export interface RegisterReturnPackage {
  success: boolean;
  error: string | mysql.MysqlError;
}

export async function register(request: Request, response: Response, next: CallableFunction)
{
  let returnPackage: RegisterReturnPackage = {
    success: false,
    error: "",
  };
  
  let newUserInfo: NewUser = {
    username: request.body.username,
    password: request.body.password,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    universityID: request.body.universityID,
    role: request.body.role,
    profilePicture: request.body.profilePicture,
  };

  // configure mysql connection data
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
    let queryString = "SELECT * FROM Users WHERE Users.username='" + newUserInfo.username + "';";

    // check if username is available
    connection.query(queryString, (error: string, rows: Array<Object>) => {
      if (error)
			{
        connection.end();
        returnPackage.error = error;
        response.json(returnPackage);
        response.status(500);
        response.send();
        return;
      }

      // send error if username is already taken
      if (rows.length > 0)
			{
        connection.end();
        returnPackage.error = "Username unavailable";
        response.json(returnPackage);
        response.status(400);
        response.send();
        return;
      }

      // formulate the query string
      queryString = "INSERT INTO Users (";
      queryString = queryString.concat("username, firstName, lastName, password, email, universityID, role)\n");
      queryString = queryString.concat("VALUES ('" + newUserInfo.username + "', '" + newUserInfo.firstname + "', '");
      queryString = queryString.concat(newUserInfo.lastname +"', '" + newUserInfo.password + "', '" + newUserInfo.email + "', ");
      queryString = queryString.concat(newUserInfo.universityID + ", " + newUserInfo.role + ");");

      // insert the new user in the database
      connection.query(queryString, (error: string) => {
        if (error) {
          connection.end();
          returnPackage.error = error;
          response.json(returnPackage);
          response.status(500);
          response.send();
          return;
        }

        // create query string to find new user based on info inserted into DB
        queryString = "SELECT * FROM Users WHERE Users.username='" + newUserInfo.username + "';";

        // make sure new user was inserted in to the database
        connection.query(queryString, (error: string, rows: SqlUser[]) => {
          if (error)
					{
            connection.end();
            returnPackage.error = error;
            response.json(returnPackage);
            response.status(500);
            response.send();
            return;
          }

          if ((rows === undefined) || (rows.length < 1))
					{
            connection.end();
            error = "Failed to register new user";
            response.json(returnPackage);
            response.status(500);
            response.send();
            return;
          }

          // parse user Data into local variable for easier manipulation
          let rawData: SqlUser = rows[0];

					// create SQL statement to insert user's student record into the Students table
					queryString = "INSERT INTO Students (userID, universityID, isApproved) VALUES (" + rawData.ID + ", " + rawData.universityID + ", true);";

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

						// append a statement to the query string to insert a record for the user's profile picture
						if (request.body.profilePicture !== undefined)
						{
							queryString = "INSERT INTO Profile_Pictures (userID, picture) VALUES (" + rawData.ID + ", '" + newUserInfo.profilePicture + "');";
						}
						else
						{
							queryString = "INSERT INTO Profile_Pictures (userID, picture) VALUES (" + rawData.ID + ", '');";
						}
	
						connection.query(queryString, (error: string) => {
							if (error)
							{
								connection.end();
								returnPackage.success = true; // setting success to true because the user was inserted if we got this far
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
        });
      });
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
