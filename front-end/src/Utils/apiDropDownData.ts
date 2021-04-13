import {
	GetMeetingTypesResponse,
	GetRsoResponse,
	GetStatesResponse,
	GetUniversitiesResponse
} from "../types/apiResponseBodies";
import {
	GetRsoRequest,
	GetUniversitiesRequest,
} from "../types/apiRequestBodies";

// util imports
import buildpath from "../Utils/buildpath";

export const fetchStates = async (): Promise<Map<string, number>> => {

	let request: Object = {
		method: "POST",
		body: JSON.stringify({}),
		headers: {
			"Content-Type": "application/json",
		},
	};

	let response: GetStatesResponse = (await (await fetch(buildpath("/api/getStates"), request)).json());
	let mappedStates: Map<string, number> = new Map<string, number>();

	if (!response.success)
	{
		console.error(response.error);
	}

	for (let state of response.states)
	{
		mappedStates.set(state.name, state.ID);
	}

	return mappedStates;
};

export const fetchAllRSOs = async (universityID: number): Promise<Map<string, number>> => {
	if (typeof universityID === "string") {
		console.error("UniversityID is not numeric");
	}

	let payload: GetRsoRequest = {
		// TODO: Remove hard coded values when app is functional
		universityID: (typeof universityID === "string") ? 1 : universityID,
	};

	let request: Object = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json",
		},
	};

	let response: GetRsoResponse = await (await fetch(buildpath("/api/getRso"), request)).json();
	let mappedRSOs: Map<string, number> = new Map<string, number>();

	if (!response.success)
	{
		console.error(response.error);
	}

	for (let rso of response.RSOs)
	{
		mappedRSOs.set(rso.name, rso.ID);
	}

	return mappedRSOs;
};

export const fetchMeetingTypes = async (): Promise<Map<string, number>> => {
	let request: Object = {
		method: "POST",
		body: JSON.stringify({}),
		headers: {
			"Content-Type": "application/json",
		},
	};

	let response: GetMeetingTypesResponse = await (await fetch(buildpath("/api/getMeetingTypes"), request)).json();
	let mappedTypes: Map<string, number> = new Map<string, number>();

	if (!response.success)
	{
		console.error(response.error);
	}

	for (let type of response.meetingTypes)
	{
		mappedTypes.set(type.name, type.ID);
	}

	return mappedTypes;
};

export const fetchUniversityData = async (universityID: number): Promise<Map<string, number>> => {
	let payload: GetUniversitiesRequest = {};

	if (typeof universityID === "string")
	{
		console.error("Stud User university ID is not specified");
	}
	else
	{
		payload.universityID = universityID;
	}

	let request: Object = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json",
		},
	};

	let response: GetUniversitiesResponse = await (await fetch(buildpath("/api/getUniversities"), request)).json();
	let mappedUniversities: Map<string, number> = new Map<string, number>();

	if (!response.success)
	{
		console.error(response.error);
	}

	for (let university of response.universities)
	{
		mappedUniversities.set(university.name, university.ID);
	}

	return mappedUniversities;
};
