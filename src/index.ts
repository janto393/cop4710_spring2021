import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express from "express";

// Endpoint imports
import { createAttendee } from "./api/createAttendee";
import { createEvent } from "./api/createEvent";
import { createMeetingType } from "./api/createMeetingType";
import { createRso } from "./api/createRso";
import { deleteEvent } from "./api/deleteEvent";
import { updateEvent } from "./api/updateEvent";
import { getEvents } from "./api/getEvents";
import { getMeetingTypes } from "./api/getMeetingTypes";
import { getRso } from "./api/getRso";
import { getStates } from "./api/getStates";
import { login } from "./api/login";
import { register } from "./api/register";
import { updateUser } from "./api/updateUser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// bodyParser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (_, res) => {
	res.status(200).send();
});

app.post("/api/createAttendee", createAttendee);
app.post("/api/createEvent", createEvent);
app.post("/api/createMeetingType", createMeetingType);
app.post("/api/createRso", createRso);
app.post("/api/deleteEvent", deleteEvent);
app.post("/api/updateEvent", updateEvent);
app.post("/api/getEvents", getEvents);
app.post("/api/getMeetingTypes", getMeetingTypes);
app.post("/api/getRso", getRso);
app.post("/api/getStates", getStates);
app.post("/api/login", login);
app.post("/api/register", register);
app.post("/api/updateUser", updateUser);

app.listen(PORT, () => console.log("Running on port " + PORT));
