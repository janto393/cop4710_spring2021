import { EventFormData, Event } from "../../types/eventTypes";

export const MAX_EVENT_PICTURES: number = 7;

export interface FormState
{
	eventName: {
    value: string,
  },
  eventDescription: {
    value: string,
  },
  university: {
    value: string,
  },
  rso: {
    value: string,
  },
  room: {
    value: string,
  },
  address: {
    value: string,
  },
  city: {
    value: string,
  },
  zip: {
    value: string,
  },
  state: {
    value: string,
  },
  isPrivateEvent: {
    value: string,
  },
  capacity: {
    value: string,
  },
  meetingType: {
    value: string,
  },
}

export const INITIAL_FORM_STATE: FormState = {
	eventName: {
    value: "",
  },
  eventDescription: {
    value: "",
  },
  university: {
    value: "",
  },
  rso: {
    value: "",
  },
  room: {
    value: "",
  },
  address: {
    value: "",
  },
  city: {
    value: "",
  },
  zip: {
    value: "",
  },
  state: {
    value: "",
  },
  isPrivateEvent: {
    value: "",
  },
  capacity: {
    value: "",
  },
  meetingType: {
    value: "",
  },
};

const INITIAL_EVENT_STATE: EventFormData = {
	schoolID: 0,
	address: "",
	city: "",
	stateID: 0,
	zip: "",
	rsoID: 0,
	meetingTypeID: 0,
	name: "",
	description: "",
	room: "",
	rating: 0,
	isPublic: false,
	capacity: 0,
	eventPictures: []
};

export function initializeEventState(event?: Event): EventFormData
{
	let formState: EventFormData = INITIAL_EVENT_STATE;

	// if an event was passed, initialize the state to the data
	// currently defined in the event
	if (event !== undefined)
	{
		formState.schoolID = event.schoolID;
		formState.address = event.address;
		formState.city = event.city;
		formState.stateID = event.state.ID;
		formState.zip = event.zip;
		formState.rsoID = event.rso.ID;
		formState.meetingTypeID = event.meetingTypeID;
		formState.name = event.name;
		formState.description = event.description;
		formState.room = event.room;
		formState.rating = event.rating;
		formState.isPublic = event.isPublic;
		formState.capacity = event.capacity;
		formState.eventPictures = event.eventPictures;
	}

	return formState;
}
