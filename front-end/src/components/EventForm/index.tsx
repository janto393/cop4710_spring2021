import React, { useState } from "react";

// util imports
import buildpath from "../../Utils/buildpath";

// component imports
import StudForm from "../StudForm/index";

// type imports
import { GetRsoRequest, GetUniversitiesRequest } from "../../types/apiRequestBodies";
import { GetMeetingTypesResponse, GetRsoResponse, GetStatesResponse, GetUniversitiesResponse } from "../../types/apiResponseBodies";
import { MeetingType, RSO, State, University } from "../../types/dropDownTypes";
import { Event, EventFormData } from "../../types/eventTypes";
import { FormFieldType } from "../StudForm";
import { useEffect } from "react";
import { UserInfoType } from "src/hooks/useStudUser";
import { Input } from "@material-ui/core";

export type ManipulateEventProps = {
	event?: Event,
	studUser: UserInfoType
}

const MAXIMUM_EVENT_PICTURES: number = 2;

function EventForm(props: ManipulateEventProps): JSX.Element
{
	const isNewEvent: boolean = (props.event === undefined);
	let initialState: EventFormData;

	// define the initial state depending on whether we're creating or updating an event
	if (props.event === undefined)
	{
		initialState = {
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
	}
	else
	{
		initialState = {
			eventID: props.event.ID,
			schoolID: props.event.university.ID,
			address: props.event.address,
			city: props.event.city,
			stateID: props.event.stateID,
			zip: props.event.zip,
			rsoID: props.event.rsoID,
			meetingTypeID: props.event.meetingTypeID,
			name: props.event.name,
			description: props.event.description,
			room: props.event.description,
			rating: props.event.rating,
			isPublic: props.event.isPublic,
			capacity: props.event.capacity,
			eventPictures: props.event.eventPictures
		};
	}

	// container object for information fields
	const [event, setEvent] = useState<EventFormData>(initialState);

	// hooks to store information to be used in drop-downs
	const [meetingTypes, setMeetingTypes] = useState<Array<MeetingType>>([]);
	const [RSOs, setRSOs] = useState<Array<RSO>>([]);
	const [states, setStates] = useState<Array<State>>([]);
	const [universities, setUniversities] = useState<Array<University>>([]);
	const [meetingTypeNames, setMeetingTypeNames] = useState<Array<string>>([]);
	const [rsoNames, setRsoNames] = useState<Array<string>>([]);
	const [stateNames, setStateNames] = useState<Array<string>>([]);
	const [universityNames, setUniversityNames] = useState<Array<string>>([]);

	const changeEventAddress = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			address: e.target.value
		});
	};

	const changeEventCapacity = (e: React.ChangeEvent<{value: number}>) => {
		setEvent({
			...event,
			capacity: e.target.value
		});
	};

	const changeEventCity = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			city: e.target.value
		});
	};

	const changeEventDescription = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			description: e.target.value
		})
	};

	const changeEventIsPublic = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			isPublic: (e.target.value === "Private")
		})
	};

	const changeEventMeetingType = (e: React.ChangeEvent<{value: string}>) => {
		// match the meeting type name to the id number
		for (let meetingType of meetingTypes)
		{
			if (meetingType.name === e.target.value)
			{
				setEvent({
					...event,
					meetingTypeID: meetingType.ID
				});
				return;
			}
		}

		// if we get here, a drop-down item doesn't match a meeting type, which means
		// something is very wrong
		console.error("Meeting Type drop-down item did not match a meeting type ID");
	};

	const changeEventName = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			name: e.target.value
		});
	};

	const changeEventRoom = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			room: e.target.value
		})
	};

	const changeEventRso = (e: React.ChangeEvent<{value: string}>) => {
		// match the rso name to its id
		for (let rso of RSOs)
		{
			if (rso.name === e.target.value)
			{
				setEvent({
					...event,
					rsoID: rso.ID
				});
				return;
			}
		}

		// if we get here, a drop-down item doesn't match a rso, which means
		// something is very wrong
		console.error("RSO drop-down item did not match a rso ID");
	};

	const changeEventState = (e: React.ChangeEvent<{value: string}>) => {
		// match the state name to the id number
		for (let state of states)
		{
			if (state.name === e.target.value)
			{
				setEvent({
					...event,
					stateID: state.ID
				});
				return;
			}
		}

		// if we get here, a drop-down item doesn't match a state, which means
		// something is very wrong
		console.error("State drop-down item did not match a state ID");
	};

	const changeEventImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files !== null)
		{
			if (e.target.files.length > 0)
			{
				let picturesArray: Array<Buffer> = event.eventPictures;
				let startIndex: number;

				// if we don't have enough space left to insert the new pictures without overwriting
				// additional files, then adjust the index to fit the selected image
				if (e.target.files.length + event.eventPictures.length > MAXIMUM_EVENT_PICTURES)
				{
					// we selected more files than the maximum allowed, so we will only write until
					// we hit the maximum
					if (MAXIMUM_EVENT_PICTURES - e.target.files.length < 0)
					{
						startIndex = 0;
					}
					else
					{
						startIndex = event.eventPictures.length - e.target.files.length - 1;
					}
				}
				else
				{
					startIndex = event.eventPictures.length;
				}

				/**
				 * write all the files that were selected until we reach the max number of pictures,
				 * or we write all the files selected, whichever comes first. If we selected more
				 * pictures than we currently have space in the array, the selected files will
				 * overwrite the files from front-to-back of the needed partition as needed
				 */
				for (let i: number = startIndex, pictureIndex: number = 0; (i < MAXIMUM_EVENT_PICTURES) && (pictureIndex < e.target.files.length); i++, pictureIndex++)
				{
					// if we are on an index that already has a file, then overwrite it
					if (i < event.eventPictures.length)
					{
						console.log("Overwriting picture at index " + String(i) + " with file " + String(pictureIndex));
						picturesArray[i] = Buffer.from(await e.target.files[pictureIndex].text(), "base64");
					}

					// we need to push a picture to the array
					else
					{
						console.log("Pushing file " + String(pictureIndex));
						picturesArray.push(Buffer.from(await e.target.files[pictureIndex].text(), "base64"));
					}
				}

				setEvent({
					...event,
					eventPictures: picturesArray
				});
			}
		}
	};

	const changeEventUniversity = (e: React.ChangeEvent<{value: string}>) => {
		// match the university name to the id number
		for (let university of universities)
		{
			if (university.name === e.target.value)
			{
				setEvent({
					...event,
					schoolID: university.ID
				});
				return;
			}
		}

		// if we get here, a drop-down item doesn't match a university, which means
		// something is very wrong
		console.error("University drop-down item did not match a university ID");
	};

	const changeEventZip = (e: React.ChangeEvent<{value: string}>) => {
		setEvent({
			...event,
			zip: e.target.value
		});
	};

	const extractMeetingTypeNames = (): void => {
		let names: Array<string> = [];

		for (let mt of meetingTypes)
		{
			names.push(mt.name);
		}

		setMeetingTypeNames(names);
	};

	const extractStateNames = (): void => {
		let stateNames: Array<string> = [];

		for (let state of states)
		{
			stateNames.push(state.name);
		}

		setStateNames(stateNames);
	};

	const extractRsoNames = (): void => {
		let names: Array<string> = []

		for (let rso of RSOs)
		{
			names.push(rso.name);
		}

		setRsoNames(names);
	};

	const extractUniversityNames = (): void => {
		let names: Array<string> = [];

		for (let university of universities)
		{
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
					"Content-Type": "application/json"
				}
			};
	
			fetch(buildpath("/api/getStates"), request)
			.then((response: Response): Promise<GetStatesResponse> => {
				return response.json();
			})
			.then((data: GetStatesResponse): void => {
				if (!data.success)
				{
					console.error(data.error);
					return;
				}
	
				setStates(data.states);
			});
		};

		const fetchAllRSOs = (universityID: number): void => {

			if (typeof universityID === "string")
			{
				console.warn("UniversityID is not numeric")
			}
	
			let payload: GetRsoRequest = {
				universityID: (typeof universityID === "string") ? 1 : universityID
			};
	
			let request: Object = {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json"
				}
			};
	
			fetch(buildpath("/api/getRso"), request)
			.then((response: Response): Promise<GetRsoResponse> => {
				return response.json();
			})
			.then((data: GetRsoResponse): void => {
				if (!data.success)
				{
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
					"Content-Type": "application/json"
				}
			};
	
			fetch(buildpath("/api/getMeetingTypes"), request)
			.then((response: Response): Promise<GetMeetingTypesResponse> => {
				return response.json();
			})
			.then((data: GetMeetingTypesResponse): void => {
				if (!data.success)
				{
					console.error(data.error);
					return;
				}
	
				setMeetingTypes(data.meetingTypes);
			});
		};
	
		const fetchUniversityData = (): void => {
			let payload: GetUniversitiesRequest = {};

			if (typeof props.studUser.universityID === "string")
			{
				console.warn("Stud User university ID is not specified");
			}
			else
			{
				payload.schoolID = props.studUser.universityID;
			}

			let request: Object = {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json"
				}
			};

			fetch(buildpath("/api/getUniversities"), request)
			.then((response: Response): Promise<GetUniversitiesResponse> => {
				return response.json();
			})
			.then((data: GetUniversitiesResponse): void => {
				if (!data.success)
				{
					console.error(data.error)
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

	let formFields: Array<FormFieldType> = [
		{
			label: "Event Name",
			fieldType: "textField",
			handleOnChange: changeEventName
		},
		{
			label: "Event Description",
			fieldType: "textField",
			handleOnChange: changeEventDescription
		},
		{
			label: "University",
			fieldType: "dropDown",
			selectItems: universityNames,
			handleOnChange: changeEventUniversity
		},
		{
			label: "RSO",
			fieldType: "dropDown",
			selectItems: rsoNames,
			handleOnChange: changeEventRso
		},
		{
			label: "Room",
			fieldType: "textField",
			handleOnChange: changeEventRoom
		},
		{
			label: "Address",
			fieldType: "textField",
			handleOnChange: changeEventAddress
		},
		{
			label: "City",
			fieldType: "textField",
			handleOnChange: changeEventCity
		},
		{
			label: "Zip",
			fieldType: "textField",
			handleOnChange: changeEventZip
		},
		{
			label: "State",
			fieldType: "dropDown",
			selectItems: stateNames,
			handleOnChange: changeEventState
		},
		{
			label: "Private Event",
			fieldType: "dropDown",
			selectItems: ["Public", "Private"],
			handleOnChange: changeEventIsPublic
		},
		{
			label: "Capacity",
			fieldType: "textField",
			handleOnChange: changeEventCapacity
		},
		{
			label: "Meeting Type",
			fieldType: "dropDown",
			selectItems: meetingTypeNames,
			handleOnChange: changeEventMeetingType
		}
	];

	useEffect(() => {
		fetchDropDownData()
		},
		[]
	);

	// extract the names of meeting types once they are fetched
	useEffect(() => {
			extractMeetingTypeNames();
		},
		[meetingTypes]
	);

	// extract the names of RSOs once they are fetched
	useEffect(() => {
			extractRsoNames();
		},
		[RSOs]
	);

	// extract the names of states once they are fetched
	useEffect(() => {
			extractStateNames();
		},
		[states]
	);

	// extract university names once they are fetched
	useEffect(() => {
			extractUniversityNames();
		},
		[universities]
	);



	return (
		<>
			<StudForm
				title="Create Event"
				textFields={formFields}
				buttonText={(props.event === undefined) ? "Create Event" : "Update Event"}
				handleClick={() => console.log(event)}
			/>
		</>
	)
}

export default EventForm;
