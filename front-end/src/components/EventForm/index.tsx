import {
  DropDownData,
  createEvent,
  fetchDropDownData,
  updateEvent,
} from "./apiFetches";
import { FieldType, formMap } from "../../Utils/formUtils";
import {
  FormState,
  INITIAL_FORM_STATE,
  MAX_EVENT_PICTURES,
  initializeEventState,
} from "./componentSetup";
import { useEffect, useState } from "react";

import { Event } from "../../types/eventTypes";
import { FormFieldType } from "../StudForm";
import { FormInputType } from "../LoginForm";
import React from "react";
import StudForm from "../StudForm/index";
import { StudUser } from "../../hooks/useStudUser";
import produce from "immer";

export type ManipulateEventProps = {
  studUser: StudUser;
  event?: Event;
  setIsValid: Function;
  setCanDisplayToast: Function;
};

const EventForm: React.FC<ManipulateEventProps> = (
  props: ManipulateEventProps
) => {
  const { studUser, event, setIsValid, setCanDisplayToast } = props;
  const isNewEvent: boolean = props.event === undefined;
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);

  const handleChange = (field: string, update: FormInputType) => {
    const mappedField: any = formMap.get(field);

    const updatedForm = produce((form) => {
      form[mappedField] = update;
    });
    setForm(updatedForm);
  };

  // hooks to store information to be used in drop-downs
  const [meetingTypes, setMeetingTypes] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const [RSOs, setRSOs] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const [states, setStates] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const [universities, setUniversities] = useState<Map<string, number>>(
    new Map<string, number>()
  );

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
    fetchDropDownData(props.studUser.universityID, true).then(
      (dropDownData: DropDownData) => {
        setMeetingTypes(dropDownData.meetingTypes);
        setRSOs(dropDownData.RSOs);
        setStates(dropDownData.states);
        setUniversities(dropDownData.universities);
      }
    );
  }, []);

  // package the drop down hooks to be passed to the submit functions
  let dropDownMaps: DropDownData = {
    universities: universities,
    states: states,
    RSOs: RSOs,
    meetingTypes: meetingTypes,
  };

  return (
    <StudForm
      title="Create Event"
      formFields={FORM_FIELDS}
      buttonText={props.event === undefined ? "Create Event" : "Update Event"}
      handleChange={handleChange}
      handleClick={
        isNewEvent
          ? () => {
              createEvent(form, dropDownMaps, setIsValid, setCanDisplayToast);
            }
          : () => {
              updateEvent(
                form,
                dropDownMaps,
                setIsValid,
                setCanDisplayToast,
                props.event
              );
            }
      }
    />
  );
};

export default EventForm;
