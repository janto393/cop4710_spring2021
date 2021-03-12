import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express from "express";

// Endpoint imports
import { login } from "./api/login";
import { register } from "./api/register";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// bodyParser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (_, res) => {
	res.status(200).send();
});

app.post("/api/login", login);
app.post("/api/register", register);

app.listen(PORT, () => console.log("Running on port " + PORT));
