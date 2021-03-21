import bodyParser from "body-parser";
import { create } from "domain";
import * as dotenv from "dotenv";
import express from "express";

// Endpoint imports
import { createMeetingType } from "./api/createMeetingType";
import { createRso } from "./api/createRso";
import { getMeetingTypes } from "./api/getMeetingTypes";
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

app.post("/api/createMeetingType", createMeetingType);
app.post("/api/createRso", createRso);
app.post("/api/getMeetingTypes", getMeetingTypes);
app.post("/api/getStates", getStates);
app.post("/api/login", login);
app.post("/api/register", register);
app.post("/api/updateUser", updateUser);

app.listen(PORT, () => console.log("Running on port " + PORT));