// type imports
import {
	GetMeetingTypesResponse,
	GetRsoResponse,
	GetStatesResponse,
	GetUniversitiesResponse
} from "../../types/apiResponseBodies";
import {
	CreateEventRequest,
	GetRsoRequest,
	GetUniversitiesRequest,
	UpdateEventRequest
} from "../../types/apiRequestBodies";

// util imports
import buildpath from "../../Utils/buildpath";
import { FormState } from "./componentSetup";
import { Event } from "src/types/eventTypes";

export interface DropDownData
{
	states: Map<string, number>,
	RSOs: Map<string, number>,
	meetingTypes: Map<string, number>,
	universities: Map<string, number>,
};

const fetchStates = async (): Promise<Map<string, number>> => {

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

const fetchAllRSOs = async (universityID: number): Promise<Map<string, number>> => {
	if (typeof universityID === "string") {
		console.warn("UniversityID is not numeric");
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

const fetchMeetingTypes = async (): Promise<Map<string, number>> => {
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

const fetchUniversityData = async (universityID: number): Promise<Map<string, number>> => {
	let payload: GetUniversitiesRequest = {};

	if (typeof universityID === "string") {
		console.warn("Stud User university ID is not specified");
	} else {
		payload.schoolID = universityID;
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

// fetch data from the api
export const fetchDropDownData = async (universityID: number): Promise<DropDownData> => {
	let data: DropDownData = {
		states: new Map<string, number>(),
		RSOs: new Map<string, number>(),
		meetingTypes: new Map<string, number>(),
		universities: new Map<string, number>()
	};

	data.states = await fetchStates();
	data.RSOs = await fetchAllRSOs(universityID);
	data.meetingTypes = await fetchMeetingTypes();
	data.universities = await fetchUniversityData(universityID);

	return data;
};

export const createEvent = async (data: FormState, dropDownMaps: DropDownData): Promise<void> => {
	let parsedSchoolID: number | undefined = dropDownMaps.universities.get(data.university.value);
	let parsedStateID: number | undefined = dropDownMaps.states.get(data.state.value);
	let parsedRsoID: number | undefined = dropDownMaps.RSOs.get(data.rso.value);
	let parsedMeetingType: number | undefined = dropDownMaps.meetingTypes.get(data.meetingType.value);

	// ensure school selection is valid
	if (parsedSchoolID === undefined)
	{
		console.error("School selection does not map to valid ID");
		return;
	}

	// ensure state selection is valid
	if (parsedStateID === undefined)
	{
		console.error("State selection does not map to valid ID");
		return;
	}

	// ensure rso selection is valid
	if (parsedRsoID === undefined)
	{
		console.error("RSO selection does not map to valid ID");
		return;
	}

	// ensure meeting type selection is valid
	if (parsedMeetingType === undefined)
	{
		console.error("Meeting Type selection does not map to valid ID");
		return;
	}

	let newEvent: CreateEventRequest = {
		schoolID: parsedSchoolID,
		address: data.address.value,
		city: data.city.value,
		stateID: parsedStateID,
		zip: data.zip.value,
		rsoID: parsedRsoID,
		meetingTypeID: parsedMeetingType,
		name: data.eventName.value,
		description: data.eventDescription.value,
		room: data.room.value,
		rating: 0,
		isPublic: !Boolean(data.isPrivateEvent.value),
		numAttendees: 0,
		capacity: Number(data.capacity.value),
		eventPictures: [] // TODO: Implement pictures
	};

	let request: Object = {
		method: "POST",
		body: JSON.stringify(newEvent),
		headers: {
			"Content-Type": "application/json"
		}
	};

	fetch(buildpath("/api/createEvent"), request);
};

export const updateEvent = async (data: FormState, dropDownMaps: DropDownData, event?: Event): Promise<void> => {
	// check to ensure event is not null (technically redundant but compiler throws a fit
	// if we do not check)
	if (event === undefined)
	{
		console.error("Trying to update event when none was passed");
		return;
	}

	let parsedStateID: number | undefined = dropDownMaps.states.get(data.state.value);
	let parsedRsoID: number | undefined = dropDownMaps.RSOs.get(data.rso.value);
	let parsedMeetingType: number | undefined = dropDownMaps.meetingTypes.get(data.meetingType.value);

	// ensure state selection is valid
	if (parsedStateID === undefined)
	{
		console.error("State selection does not map to valid ID");
		return;
	}

	// ensure rso selection is valid
	if (parsedRsoID === undefined)
	{
		console.error("RSO selection does not map to valid ID");
		return;
	}

	// ensure meeting type selection is valid
	if (parsedMeetingType === undefined)
	{
		console.error("Meeting Type selection does not map to valid ID");
		return;
	}

	let payload: UpdateEventRequest = {
		eventID: event.ID,
		name: (data.eventName.value === "") ? undefined : data.eventName.value,
		rsoID: (data.rso.value === "") ? undefined : parsedRsoID,
		room: (data.room.value === "") ? undefined : data.room.value,
		address: (data.address.value === "") ? undefined : data.address.value,
		city: (data.city.value === "") ? undefined : data.city.value,
		zip: (data.zip.value === "") ? undefined : data.zip.value,
		stateID: (data.zip.value === "") ? undefined : parsedStateID,
		isPublic: (data.isPrivateEvent.value === "") ? undefined : !Boolean(data.isPrivateEvent.value),
		capacity: (data.capacity.value === "") ? undefined : Number(data.capacity.value),
		meetingType: (data.meetingType.value === "") ? undefined : parsedMeetingType
	};

	let request: Object = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json"
		}
	};

	fetch(buildpath("/api/updateEvent"), request);
};
