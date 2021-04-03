import { useState } from "react";
import { UserDataWithoutPassword } from "src/types/userTypes";

// util imports
import buildpath from "../Utils/buildpath";

// type imports
import { GetRsoRequest } from "../types/apiRequestBodies";
import { GetMeetingTypesResponse, GetRsoResponse, GetStatesResponse } from "../types/apiResponseBodies";
import { MeetingType, RSO, State, University } from "../types/dropDownTypes";
import { NewEvent } from "../types/eventTypes";

function createEventPage(): JSX.Element
{
	// hooks to store information to be used in drop-downs
	const [meetingTypes, setMeetingTypes] = useState<Array<MeetingType>>([]);
	const [RSOs, setRSOs] = useState<Array<RSO>>([]);
	const [states, setStates] = useState<Array<State>>([]);

	// hooks to store event information
	const [schoolID, setSchoolID] = useState<number>(-1);
	const [address, setAddress] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [stateID, setStateID] = useState<number>(-1);
	const [zip, setZip] = useState<string>("");
	const [rsoID, setRsoID] = useState<number>(-1);
	const [meetingTypeID, setMeetingTypeID] = useState<number>(-1);
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [room, setRoom] = useState<string>("");
	const [rating, setRating] = useState<number>(0);
	const [isPublic, setIsPublic] = useState<boolean>(true);
	const [capacity, setCapacity] = useState<number>(0);
	const [eventPicture, setEventPictures] = useState<Array<Buffer>>([]);

	// fetch the data to populate into the drop downs
	const fetchDropDownData = (): void => {
		// ensure the required .env fields are configured correctly
		if (process.env.REACT_APP_LS_USER_DATA === undefined)
		{
			console.error("required .env fields are missing");
			return;
		}

		// fetch the user data from local storage
		let rawUserData: string | null = localStorage.getItem(process.env.REACT_APP_LS_USER_DATA);

		// ensure the user data exists
		if (rawUserData === null)
		{
			console.error("User data does not exist");
			return;
		}

		// parse the user Data into a json object
		let userData: UserDataWithoutPassword = JSON.parse(rawUserData);

		
	};

	const fetchStates = (): void => {
		let request: Object = {
			method: "POST",
			body: {},
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
		let payload: GetRsoRequest = {
			universityID: universityID
		};

		let request: Object = {
			method: "POST",
			body: payload,
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
			body: {},
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(buildpath("/api/getMeetingType"), request)
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

	return (
		<>
			<div className="EventForm">
				
			</div>
		</>
	)
}

export default createEventPage;
