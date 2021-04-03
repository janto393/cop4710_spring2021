import * as mysql from "mysql";

import { Request, Response, request } from "express";
import { SqlProfilePictures, SqlUser } from "src/commonTypes/sqlSchema";

import { NewUser } from "../commonTypes/UserTypes";
import configureSqlConnection from "../util/configureSqlConnection";

// utility imports

// type imports

/**
 * only returns success and error because website will redirect
 * new users to the login menu after registering
 */
export interface RegisterReturnPackage {
  success: boolean;
  error: string;
}

export async function register(
  request: Request,
  response: Response,
  next: CallableFunction
) {
  let returnPackage: RegisterReturnPackage = {
    success: false,
    error: "",
  };
  const { username, password } = request.body;
  let newUserInfo: NewUser = {
    username: request.body.username,
    password: request.body.password,
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    universityID: request.body.universityID,
    rsoID: request.body.rsoID,
    role: request.body.role,
    profilePicture: request.body.profilePicture,
  };

  // configure mysql connection data
  const connectionData: mysql.ConnectionConfig = configureSqlConnection();

  const connection: mysql.Connection = mysql.createConnection(connectionData);

  try {
    connection.connect();
  } catch (e) {
    returnPackage.error = e;
    response.json(returnPackage);
    response.status(500);
    response.send();
    return;
  }

  try {
    let queryString =
      "SELECT * FROM Users WHERE Users.username='" +
      newUserInfo.username +
      "';";

    // check if username is available
    connection.query(queryString, (error: string, rows: Array<Object>) => {
      if (error) {
        connection.end();
        returnPackage.error = error;
        response.json(returnPackage);
        response.status(500);
        response.send();
        return;
      }

      // send error if username is already taken
      if (rows.length > 0) {
        connection.end();
        returnPackage.error = "Username unavailable";
        response.json(returnPackage);
        response.status(400);
        response.send();
        return;
      }

      // formulate the query string
      queryString = "INSERT INTO Users (";
      queryString = queryString.concat(
        "username, firstName, lastName, password, email, universityID, rsoID, role)\n"
      );
      queryString = queryString.concat(
        "VALUES ('" +
          newUserInfo.username +
          "', '" +
          newUserInfo.firstname +
          "', '"
      );
      queryString = queryString.concat(
        newUserInfo.lastname +
          "', '" +
          newUserInfo.password +
          "', '" +
          newUserInfo.email +
          "', "
      );
      queryString = queryString.concat(
        newUserInfo.universityID +
          ", " +
          newUserInfo.rsoID +
          ", " +
          newUserInfo.role +
          ");"
      );

      // insert the new user in the database
      connection.query(queryString, (error: string, rows: Array<Object>) => {
        if (error) {
          connection.end();
          returnPackage.error = error;
          response.json(returnPackage);
          response.status(500);
          response.send();
          return;
        }

        // create query string to find new user based on info inserted into DB
        queryString =
          "SELECT * FROM Users WHERE Users.username='" +
          newUserInfo.username +
          "';";

        // make sure new user was inserted in to the database
        connection.query(queryString, (error: string, rows: Array<SqlUser>) => {
          if (error) {
            connection.end();
            returnPackage.error = error;
            response.json(returnPackage);
            response.status(500);
            response.send();
            return;
          }

          if (rows.length < 1) {
            connection.end();
            error = "Failed to register new user";
            response.json(returnPackage);
            response.status(500);
            response.send();
            return;
          }

          // parse user Data into local variable for easier manipulation
          let rawData: SqlUser = rows[0];

          // insert a record with the profile picture, if no picture was passed, create
          // a record with an empty BLOB
          if (request.body.profilePicture !== undefined) {
            queryString =
              "INSERT INTO Profile_Pictures (userID, picture) VALUES (" +
              rawData.ID +
              ", '" +
              newUserInfo.profilePicture +
              "');";
          } else {
            queryString =
              "INSERT INTO Profile_Pictures (userID, picture) VALUES (" +
              rawData.ID +
              ", '');";
          }

          connection.query(
            queryString,
            (error: string, rows: Array<Object>) => {
              if (error) {
                connection.end();
                returnPackage.success = true; // setting success to true because the user was inserted if we got this far
                returnPackage.error = error;
                response.json(returnPackage);
                response.status(500);
                response.send();
                return;
              }

              queryString =
                "SELECT * FROM Profile_Pictures WHERE userID=" +
                rawData.ID +
                ";";

              // make sure the record was created
              connection.query(
                queryString,
                (error: string, rows: Array<SqlProfilePictures>) => {
                  if (error) {
                    connection.end();
                    returnPackage.success = true; // setting success to true because the user was inserted if we got this far
                    returnPackage.error = error;
                    response.json(returnPackage);
                    response.status(500);
                    response.send();
                    return;
                  }

                  if (rows.length < 1) {
                    returnPackage.error = "Failed to upload profile picture";
                  }

                  connection.end();
                  returnPackage.success = true;
                  response.json(returnPackage);
                  response.status(200);
                  response.send();
                }
              );
            }
          );
        });
      });
    });
  } catch (e) {
    connection.end();

    returnPackage.error = e;
    response.json(returnPackage);
    response.status(500);
    response.send();
    return;
  }
}
