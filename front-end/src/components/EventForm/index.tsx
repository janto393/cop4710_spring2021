import React from "react";
import {
	useState,
	useEffect
} from "react";
import {
	DropDownData,
	fetchDropDownData,
	createEvent,
	updateEvent
} from "./apiFetches";
import {
	MAX_EVENT_PICTURES,
	INITIAL_FORM_STATE,
	initializeEventState,
	FormState
} from "./componentSetup";

import { Event } from "../../types/eventTypes";
import { FieldType, UNIVERSITY_DROPDOWN, formMap } from "src/Utils/formUtils";
import { MeetingType, RSO, State, University } from "../../types/dropDownTypes";
import { FormFieldType } from "../StudForm";
import { FormInputType } from "../LoginForm";
import StudForm from "../StudForm/index";
import { StudUser } from "src/hooks/useStudUser";
import produce from "immer";

export type ManipulateEventProps = {
  studUser: StudUser;
  event?: Event;
};

const EventForm: React.FC<ManipulateEventProps> = (
	props: ManipulateEventProps
) => {
  const { studUser } = props;
  const isNewEvent: boolean = (props.event === undefined);
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);

  // 2. create handleChange fn with produce()
  const handleChange = (field: string, update: FormInputType) => {
    const mappedField: any = formMap.get(field);

    const updatedForm = produce((form) => {
      form[mappedField] = update;
    });
    setForm(updatedForm);
  };

  // hooks to store information to be used in drop-downs
  const [meetingTypes, setMeetingTypes] = useState<Map<string, number>>(new Map<string, number>());
	const [RSOs, setRSOs] = useState<Map<string, number>>(new Map<string, number>());
	const [states, setStates] = useState<Map<string, number>>(new Map<string, number>());
	const [universities, setUniversities] = useState<Map<string, number>>(new Map<string, number>());

  // 3. pass that to studForms

  // 4. use form state as body of api request

  const FORM_FIELDS: Array<FormFieldType> = [
    {
      fieldTitle: "Event Name",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Event Description",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "University",
      fieldType: FieldType.DROP_DOWN,
      selectItems: Array.from(universities.keys()),
    },
    {
      fieldTitle: "RSO",
      fieldType: FieldType.DROP_DOWN,
      selectItems: Array.from(RSOs.keys()),
    },
    {
      fieldTitle: "Room",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Address",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "City",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Zip",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "State",
      fieldType: FieldType.DROP_DOWN,
      selectItems: Array.from(states.keys()),
    },
    {
      fieldTitle: "Private Event",
      fieldType: FieldType.DROP_DOWN,
      selectItems: ["Public", "Private"],
    },
    {
      fieldTitle: "Capacity",
      fieldType: FieldType.TEXT_FIELD,
    },
    {
      fieldTitle: "Meeting Type",
      fieldType: FieldType.DROP_DOWN,
      selectItems: Array.from(meetingTypes.keys()),
    },
  ];

  useEffect(() => {
    fetchDropDownData(props.studUser.universityID)
		.then((dropDownData: DropDownData) => {
			setMeetingTypes(dropDownData.meetingTypes);
			setRSOs(dropDownData.RSOs);
			setStates(dropDownData.states);
			setUniversities(dropDownData.universities);
		});
  }, []);

  return (
    <StudForm
      title="Create Event"
      formFields={FORM_FIELDS}
      buttonText={(props.event === undefined) ? "Create Event" : "Update Event"}
      handleChange={handleChange}
      handleClick={(isNewEvent) ? () => {createEvent(form)} : () => {updateEvent(form, props.event)}}
    />
  );
};

export default EventForm;
