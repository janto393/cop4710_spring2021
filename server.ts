// Program dependencies
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, json, Response, Request} from 'express';
import path from 'path';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(json());

// Environment Variable Configuration
const PORT: string | number = process.env.PORT || 5000;
app.set('port', PORT);

// // MySQL connection setup
// const mysql = require('mysql');
// const connection = mysql.createConnection({
// 	host : process.env.RDS_HOSTNAME,
// 	user : process.env.RDS_USERNAME,
// 	password : process.env.RDS_PASSWORD,
// 	port : process.env.RDS_PORT
// });

// // Server static assets if in production
// if (process.env.NODE_ENV === 'production') 
// {
//   // Set static folder
//   app.use(express.static(path.join(__dirname, 'front-end', 'build')));

//   app.get('*', (request, res) => 
// 	{
//     res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'));
// 	});
// }

app.post("/api/helloWorld", async (request, response, next) => {
	console.log("hello, world");
});

app.listen(PORT, () => {console.log("Server running on port " + process.env.PORT)}); // start Node + Expresponses server on specified port
