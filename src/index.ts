import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";

// Endpoint imports
import { approveDenyRSOs } from "./api/approveDenyRSOs";
import { approveDenyStudents } from "./api/approveDenyStudents";
import { createAttendee } from "./api/createAttendee";
import { createEvent } from "./api/createEvent";
import { createEventComment } from "./api/createEventComment";
import { deleteEventComment } from "./api/deleteEventComment";
import { createMeetingType } from "./api/createMeetingType";
import { createRso } from "./api/createRso";
import { createUniversity } from "./api/createUniversity";
import { deleteAttendee } from "./api/deleteAttendee";
import { deleteEvent } from "./api/deleteEvent";
import { deleteRso } from "./api/deleteRso";
import { getEvents } from "./api/getEvents";
import { getMeetingTypes } from "./api/getMeetingTypes";
import { getRSOs } from "./api/getRSOs";
import { getStates } from "./api/getStates";
import { getStudents } from "./api/getStudents";
import { getUniversities } from "./api/getUniversities";
import { joinRSO } from "./api/joinRSO";
import { login } from "./api/login";
import { rateEvent } from "./api/rateEvent";
import { register } from "./api/register";
import { updateEvent } from "./api/updateEvent";
import { updateEventComment } from "./api/updateEventComment";
import { updateRso } from "./api/updateRso";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// bodyParser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Access Control Logic
app.use((request: Request, response: Response, next: CallableFunction) => 
{
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-requestuested-With, Content-Type, Accept, Authorization'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
}); 

app.get('/', (_, res) => {
	res.status(200).send();
});

app.post("/api/approveDenyRSOs", approveDenyRSOs);
app.post("/api/approveDenyStudents", approveDenyStudents);
app.post("/api/createEventComment", createEventComment);
app.post("/api/createAttendee", createAttendee);
app.post("/api/createEvent", createEvent);
app.post("/api/createMeetingType", createMeetingType);
app.post("/api/createRso", createRso);
app.post("/api/createUniversity", createUniversity);
app.post("/api/deleteAttendee", deleteAttendee);
app.post("/api/deleteEvent", deleteEvent);
app.post("/api/deleteEventComment", deleteEventComment);
app.post("/api/deleteRso", deleteRso);
app.post("/api/getEvents", getEvents);
app.post("/api/getMeetingTypes", getMeetingTypes);
app.post("/api/getRSOs", getRSOs);
app.post("/api/getStates", getStates);
app.post("/api/getStudents", getStudents);
app.post("/api/getUniversities", getUniversities);
app.post("/api/joinRSO", joinRSO);
app.post("/api/login", login);
app.post("/api/rateEvent", rateEvent);
app.post("/api/register", register);
app.post("/api/updateEvent", updateEvent);
app.post("/api/updateEventComment", updateEventComment);
app.post("/api/updateRso", updateRso);

app.listen(PORT, () => console.log("Running on port " + PORT));
