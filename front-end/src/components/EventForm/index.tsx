import { Event, EventFormData } from "../../types/eventTypes";
import { FieldType, UNIVERSITY_DROPDOWN, formMap } from "src/Utils/formUtils";
import {
  GetMeetingTypesResponse,
  GetRsoResponse,
  GetStatesResponse,
  GetUniversitiesResponse,
} from "../../types/apiResponseBodies";
import {
  GetRsoRequest,
  GetUniversitiesRequest,
} from "../../types/apiRequestBodies";
import { MeetingType, RSO, State, University } from "../../types/dropDownTypes";
import React, { useState } from "react";

import { FormFieldType } from "../StudForm";
import { FormInputType } from "../LoginForm";
import StudForm from "../StudForm/index";
import { StudUser } from "src/hooks/useStudUser";
import axios from "axios";
import { baseUrl } from "src/Utils/apiUtils";
import buildpath from "../../Utils/buildpath";
import produce from "immer";
import { useEffect } from "react";

// util imports

// component imports

// type imports

export type ManipulateEventProps = {
  studUser: StudUser;
  event?: Event;
};

const INITIAL_FORM_STATE = {
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

const MAXIMUM_EVENT_PICTURES: number = 2;

const EventForm: React.FC<ManipulateEventProps> = (
  props: ManipulateEventProps
) => {
  const { studUser } = props;
  const isNewEvent: boolean = props.event === undefined;
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  // 2. create handleChange fn with produce()
  const handleChange = (field: string, update: FormInputType) => {
    const mappedField: any = formMap.get(field);

    const updatedForm = produce((form) => {
      form[mappedField] = update;
    });
    setForm(updatedForm);
  };

  //   let initialState: EventFormData;

  //   // define the initial state depending on whether we're creating or updating an event
  //   if (props.event === undefined) {
  //     initialState = {
  //       schoolID: 0,
  //       address: "",
  //       city: "",
  //       stateID: 0,
  //       zip: "",
  //       rsoID: 0,
  //       meetingTypeID: 0,
  //       name: "",
  //       description: "",
  //       room: "",
  //       rating: 0,
  //       isPublic: false,
  //       capacity: 0,
  //       eventPictures: [],
  //     };
  //   } else {
  //     initialState = {
  //       eventID: props.event.ID,
  //       schoolID: props.event.university.ID,
  //       address: props.event.address,
  //       city: props.event.city,
  //       stateID: props.event.stateID,
  //       zip: props.event.zip,
  //       rsoID: props.event.rso.ID,
  //       meetingTypeID: props.event.meetingTypeID,
  //       name: props.event.name,
  //       description: props.event.description,
  //       room: props.event.description,
  //       rating: props.event.rating,
  //       isPublic: props.event.isPublic,
  //       capacity: props.event.capacity,
  //       eventPictures: props.event.eventPictures,
  //     };
  //   }

  // container object for information fields
  //   const [event, setEvent] = useState<EventFormData>(initialState);

  // hooks to store information to be used in drop-downs
  const [meetingTypes, setMeetingTypes] = useState<Array<MeetingType>>([]);
  const [RSOs, setRSOs] = useState<Array<RSO>>([]);
  const [states, setStates] = useState<Array<State>>([]);
  const [universities, setUniversities] = useState<Array<University>>([]);
  const [meetingTypeNames, setMeetingTypeNames] = useState<Array<string>>([]);
  const [rsoNames, setRsoNames] = useState<Array<string>>([]);
  const [stateNames, setStateNames] = useState<Array<string>>([]);
  const [universityNames, setUniversityNames] = useState<Array<string>>([]);

  //   const changeEventAddress = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       address: e.target.value,
  //     });
  //   };

  //   const changeEventCapacity = (e: React.ChangeEvent<{ value: number }>) => {
  //     setEvent({
  //       ...event,
  //       capacity: e.target.value,
  //     });
  //   };

  //   const changeEventCity = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       city: e.target.value,
  //     });
  //   };

  //   const changeEventDescription = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       description: e.target.value,
  //     });
  //   };

  //   const changeEventIsPublic = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       isPublic: e.target.value === "Private",
  //     });
  //   };

  //   const changeEventMeetingType = (e: React.ChangeEvent<{ value: string }>) => {
  //     // match the meeting type name to the id number
  //     for (let meetingType of meetingTypes) {
  //       if (meetingType.name === e.target.value) {
  //         setEvent({
  //           ...event,
  //           meetingTypeID: meetingType.ID,
  //         });
  //         return;
  //       }
  //     }

  //     // if we get here, a drop-down item doesn't match a meeting type, which means
  //     // something is very wrong
  //     console.error(
  //       "Meeting Type drop-down item did not match a meeting type ID"
  //     );
  //   };

  //   const changeEventName = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       name: e.target.value,
  //     });
  //   };

  //   const changeEventRoom = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       room: e.target.value,
  //     });
  //   };

  //   const changeEventRso = (e: React.ChangeEvent<{ value: string }>) => {
  //     // match the rso name to its id
  //     for (let rso of RSOs) {
  //       if (rso.name === e.target.value) {
  //         setEvent({
  //           ...event,
  //           rsoID: rso.ID,
  //         });
  //         return;
  //       }
  //     }

  //     // if we get here, a drop-down item doesn't match a rso, which means
  //     // something is very wrong
  //     console.error("RSO drop-down item did not match a rso ID");
  //   };

  //   const changeEventState = (e: React.ChangeEvent<{ value: string }>) => {
  //     // match the state name to the id number
  //     for (let state of states) {
  //       if (state.name === e.target.value) {
  //         setEvent({
  //           ...event,
  //           stateID: state.ID,
  //         });
  //         return;
  //       }
  //     }

  //     // if we get here, a drop-down item doesn't match a state, which means
  //     // something is very wrong
  //     console.error("State drop-down item did not match a state ID");
  //   };

  //   const changeEventImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files !== null) {
  //       if (e.target.files.length > 0) {
  //         let picturesArray: Array<Buffer> = event.eventPictures;
  //         let startIndex: number;

  //         // if we don't have enough space left to insert the new pictures without overwriting
  //         // additional files, then adjust the index to fit the selected image
  //         if (
  //           e.target.files.length + event.eventPictures.length >
  //           MAXIMUM_EVENT_PICTURES
  //         ) {
  //           // we selected more files than the maximum allowed, so we will only write until
  //           // we hit the maximum
  //           if (MAXIMUM_EVENT_PICTURES - e.target.files.length < 0) {
  //             startIndex = 0;
  //           } else {
  //             startIndex = event.eventPictures.length - e.target.files.length - 1;
  //           }
  //         } else {
  //           startIndex = event.eventPictures.length;
  //         }

  //         /**
  //          * write all the files that were selected until we reach the max number of pictures,
  //          * or we write all the files selected, whichever comes first. If we selected more
  //          * pictures than we currently have space in the array, the selected files will
  //          * overwrite the files from front-to-back of the needed partition as needed
  //          */
  //         for (
  //           let i: number = startIndex, pictureIndex: number = 0;
  //           i < MAXIMUM_EVENT_PICTURES && pictureIndex < e.target.files.length;
  //           i++, pictureIndex++
  //         ) {
  //           // if we are on an index that already has a file, then overwrite it
  //           if (i < event.eventPictures.length) {
  //             console.log(
  //               "Overwriting picture at index " +
  //                 String(i) +
  //                 " with file " +
  //                 String(pictureIndex)
  //             );
  //             picturesArray[i] = Buffer.from(
  //               await e.target.files[pictureIndex].text(),
  //               "base64"
  //             );
  //           }

  //           // we need to push a picture to the array
  //           else {
  //             console.log("Pushing file " + String(pictureIndex));
  //             picturesArray.push(
  //               Buffer.from(await e.target.files[pictureIndex].text(), "base64")
  //             );
  //           }
  //         }

  //         setEvent({
  //           ...event,
  //           eventPictures: picturesArray,
  //         });
  //       }
  //     }
  //   };

  //   const changeEventUniversity = (e: React.ChangeEvent<{ value: string }>) => {
  //     // match the university name to the id number
  //     for (let university of universities) {
  //       if (university.name === e.target.value) {
  //         setEvent({
  //           ...event,
  //           schoolID: university.ID,
  //         });
  //         return;
  //       }
  //     }

  //     // if we get here, a drop-down item doesn't match a university, which means
  //     // something is very wrong
  //     console.error("University drop-down item did not match a university ID");
  //   };

  //   const changeEventZip = (e: React.ChangeEvent<{ value: string }>) => {
  //     setEvent({
  //       ...event,
  //       zip: e.target.value,
  //     });
  //   };

  const extractMeetingTypeNames = (): void => {
    let names: Array<string> = [];

    for (let mt of meetingTypes) {
      names.push(mt.name);
    }

    setMeetingTypeNames(names);
  };

  const extractStateNames = (): void => {
    let stateNames: Array<string> = [];

    for (let state of states) {
      stateNames.push(state.name);
    }

    setStateNames(stateNames);
  };

  const extractRsoNames = (): void => {
    let names: Array<string> = [];

    for (let rso of RSOs) {
      names.push(rso.name);
    }

    setRsoNames(names);
  };

  const extractUniversityNames = (): void => {
    let names: Array<string> = [];

    for (let university of universities) {
      names.push(university.name);
    }

    setUniversityNames(names);
  };

  // fetch the data to populate into the drop downs
  const fetchDropDownData = (): void => {
    const fetchStates = (): void => {
      let request: Object = {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(buildpath("/api/getStates"), request)
        .then(
          (response: Response): Promise<GetStatesResponse> => {
            return response.json();
          }
        )
        .then((data: GetStatesResponse): void => {
          if (!data.success) {
            console.error(data.error);
            return;
          }

          setStates(data.states);
        });
    };

    const fetchAllRSOs = (universityID: number): void => {
      if (typeof universityID === "string") {
        console.warn("UniversityID is not numeric");
      }

      let payload: GetRsoRequest = {
        universityID: typeof universityID === "string" ? 1 : universityID,
      };

      let request: Object = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(buildpath("/api/getRso"), request)
        .then(
          (response: Response): Promise<GetRsoResponse> => {
            return response.json();
          }
        )
        .then((data: GetRsoResponse): void => {
          if (!data.success) {
            console.error(data.error);
            return;
          }

          setRSOs(data.RSOs);
        });
    };

    const fetchMeetingTypes = (): void => {
      let request: Object = {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(buildpath("/api/getMeetingTypes"), request)
        .then(
          (response: Response): Promise<GetMeetingTypesResponse> => {
            return response.json();
          }
        )
        .then((data: GetMeetingTypesResponse): void => {
          if (!data.success) {
            console.error(data.error);
            return;
          }

          setMeetingTypes(data.meetingTypes);
        });
    };

    const fetchUniversityData = (): void => {
      let payload: GetUniversitiesRequest = {};

      if (typeof props.studUser.universityID === "string") {
        console.warn("Stud User university ID is not specified");
      } else {
        payload.schoolID = props.studUser.universityID;
      }

      let request: Object = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(buildpath("/api/getUniversities"), request)
        .then(
          (response: Response): Promise<GetUniversitiesResponse> => {
            return response.json();
          }
        )
        .then((data: GetUniversitiesResponse): void => {
          if (!data.success) {
            console.error(data.error);
            return;
          }

          setUniversities(data.universities);
        });
    };

    // fetch data from the api
    fetchStates();
    fetchAllRSOs(props.studUser.universityID);
    fetchMeetingTypes();
    fetchUniversityData();
  };

  // 3. pass that to studForms

  // 4. use form state as body of api request

  const formFields: Array<FormFieldType> = [
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
      selectItems: UNIVERSITY_DROPDOWN,
    },
    {
      fieldTitle: "RSO",
      fieldType: FieldType.DROP_DOWN,
      selectItems: rsoNames,
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
      selectItems: stateNames,
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
      selectItems: meetingTypeNames,
    },
  ];

  const submitCreateEvent = async () => {
    const {
      university,
      address,
      city,
      state,
      zip,
      rso,
      meetingType,
      eventName,
      eventDescription,
      room,
      isPrivateEvent,
      capacity,
    } = form;

    // logging form to see if values saved
    console.log(form);

    // API CALL TO CREATE EVENT
    // const response = await axios.post(`${baseUrl}/INSERT_ENPOIN_HERE`, {
    // 	university: university.value,
    // 	address: address.value,
    // 	city: city.value,
    // 	state: state.value,
    // 	zip: zip.value,
    // 	rso: rso.value,
    // 	meetingType: meetingType.value,
    // 	eventName: eventName.value,
    // 	eventDescription: eventDescription.value,
    // 	room: room.value,
    // 	isPrivateEvent: isPrivateEvent.value,
    // 	capacity: capacity.value
    // });
  };

  useEffect(() => {
    fetchDropDownData();
  }, []);

  // extract the names of meeting types once they are fetched
  useEffect(() => {
    extractMeetingTypeNames();
  }, [meetingTypes]);

  // extract the names of RSOs once they are fetched
  useEffect(() => {
    extractRsoNames();
  }, [RSOs]);

  // extract the names of states once they are fetched
  useEffect(() => {
    extractStateNames();
  }, [states]);

  // extract university names once they are fetched
  useEffect(() => {
    extractUniversityNames();
  }, [universities]);

  return (
    <StudForm
      title="Create Event"
      formFields={formFields}
      buttonText={props.event === undefined ? "Create Event" : "Update Event"}
      handleChange={handleChange}
      handleClick={submitCreateEvent}
    />
  );
};

export default EventForm;
