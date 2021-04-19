// type imports

import {
  CreateEventRequest,
  UpdateEventRequest,
} from "../../types/apiRequestBodies";
import {
  fetchAllRSOs,
  fetchMeetingTypes,
  fetchStates,
  fetchUniversityData,
} from "../../Utils/apiDropDownData";

import { Event } from "src/types/eventTypes";
import { FormState } from "./componentSetup";
import buildpath from "../../Utils/buildpath";

// util imports

export interface DropDownData {
  states: Map<string, number>;
  RSOs: Map<string, number>;
  meetingTypes: Map<string, number>;
  universities: Map<string, number>;
}

// fetch data from the api
export const fetchDropDownData = async (
  universityID: number,
	getApprovedRSOs: boolean
): Promise<DropDownData> => {
  let data: DropDownData = {
    states: new Map<string, number>(),
    RSOs: new Map<string, number>(),
    meetingTypes: new Map<string, number>(),
    universities: new Map<string, number>(),
  };

  data.states = await fetchStates();
  data.RSOs = await fetchAllRSOs(universityID, getApprovedRSOs);
  data.meetingTypes = await fetchMeetingTypes();
  data.universities = await fetchUniversityData(universityID);

  return data;
};

const isValidForm = (dropDownMaps: any, data: any): boolean => {
  let parsedSchoolID: number | undefined = dropDownMaps.universities.get(
    data.university.value
  );
  let parsedStateID: number | undefined = dropDownMaps.states.get(
    data.state.value
  );
  let parsedRsoID: number | undefined = dropDownMaps.RSOs.get(data.rso.value);
  let parsedMeetingType: number | undefined = dropDownMaps.meetingTypes.get(
    data.meetingType.value
  );

  // ensure school selection is valid
  if (parsedSchoolID === undefined) {
    console.error("School selection does not map to valid ID");
    return false;
  }

  // ensure state selection is valid
  if (parsedStateID === undefined) {
    console.error("State selection does not map to valid ID");
    return false;
  }

  // ensure rso selection is valid
  if (parsedRsoID === undefined) {
    console.error("RSO selection does not map to valid ID");
    return false;
  }

  // ensure meeting type selection is valid
  if (parsedMeetingType === undefined) {
    console.error("Meeting Type selection does not map to valid ID");
    return false;
  }

  return true;
};

export const createEvent = async (
  data: FormState,
  dropDownMaps: DropDownData,
  setIsValid: Function,
  setCanDisplayToast: Function
): Promise<void> => {
  let parsedSchoolID: any = dropDownMaps.universities.get(
    data.university.value
  );
  let parsedStateID: any = dropDownMaps.states.get(data.state.value);
  let parsedRsoID: any = dropDownMaps.RSOs.get(data.rso.value);
  let parsedMeetingType: any = dropDownMaps.meetingTypes.get(
    data.meetingType.value
  );

  if (isValidForm(dropDownMaps, data)) {
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
      isPublic: data.isPrivateEvent.value === "Public" ? true : false,
      numAttendees: 0,
      capacity: Number(data.capacity.value),
      eventPictures: [], // TODO: Implement pictures
    };

    let request: Object = {
      method: "POST",
      body: JSON.stringify(newEvent),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(buildpath("/api/createEvent"), request);

    if (response.status > 202) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  } else {
    setIsValid(false);
  }
  setCanDisplayToast(true);
};

export const updateEvent = async (
  data: FormState,
  dropDownMaps: DropDownData,
  setIsValid: Function,
  setCanDisplayToast: Function,
  event?: Event
): Promise<void> => {
  // check to ensure event is not null (technically redundant but compiler throws a fit
  // if we do not check)
  if (event === undefined) {
    console.error("Trying to update event when none was passed");
    return;
  }

  let parsedStateID: number | undefined = dropDownMaps.states.get(
    data.state.value
  );
  let parsedRsoID: number | undefined = dropDownMaps.RSOs.get(data.rso.value);
  let parsedMeetingType: number | undefined = dropDownMaps.meetingTypes.get(
    data.meetingType.value
  );

  let payload: UpdateEventRequest = {
    eventID: event.ID,
    name: data.eventName.value === "" ? undefined : data.eventName.value,
    rsoID: data.rso.value === "" ? undefined : parsedRsoID,
    room: data.room.value === "" ? undefined : data.room.value,
    address: data.address.value === "" ? undefined : data.address.value,
    city: data.city.value === "" ? undefined : data.city.value,
    zip: data.zip.value === "" ? undefined : data.zip.value,
    stateID: data.zip.value === "" ? undefined : parsedStateID,
    isPublic:
      data.isPrivateEvent.value === ""
        ? undefined
        : data.isPrivateEvent.value === "Public"
        ? true
        : false,
    capacity:
      data.capacity.value === "" ? undefined : Number(data.capacity.value),
    meetingType: data.meetingType.value === "" ? undefined : parsedMeetingType,
  };

  let request: Object = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(buildpath("/api/updateEvent"), request);

  if (response.status > 202) {
    setIsValid(false);
  } else {
    setIsValid(true);
  }

  setCanDisplayToast(true);
};
