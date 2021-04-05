import { useState } from "react";
import { UserInfoType } from "src/hooks/useStudUser";

// util imports
import buildpath from "../../Utils/buildpath";

// component imports
import EventCards from "./EventCard";
import { Event } from "src/types/eventTypes";
import { useEffect } from "react";
import { GetEventsRequest } from "src/types/apiRequestBodies";
import { GetEventResponse } from "src/types/apiResponseBodies";

export type EventListProps = {
	studUser: UserInfoType
}

function EventList(props: EventListProps): JSX.Element
{
	const [events, setEvents] = useState<Array<Event>>([]);

	const fetchEvents = (): void => {
		let payload: GetEventsRequest = {
			schoolID: props.studUser.universityID
		};

		console.log(props.studUser);
		console.log(typeof props.studUser.universityID);
		console.log(typeof props.studUser.rsoID);

		// hard code safety value (will remove when app is operational)
		if (props.studUser.universityID === undefined || props.studUser.universityID !== "")
		{
			console.warn("schoolID safety value triggered");
			payload.schoolID = 1;
		}

		// add the rso of the user if they are part of an RSO
		if (props.studUser.rsoID !== undefined || props.studUser.rsoID !== "")
		{
			console.log("Populating rsoID");
			payload.rsoID = props.studUser.rsoID;
		}

		let request: Object = {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(buildpath("/api/getEvents"), request)
		.then((response: Response): Promise<GetEventResponse> => {
			return response.json();
		})
		.then((data: GetEventResponse): void => {
			if (!data.success)
			{
				console.error(data.error);
				return;
			}

			setEvents(data.events);
		});
	};

	useEffect(() => {fetchEvents();}, []);

	return (
		<EventCards events={events} />
	);
}

export default EventList;
