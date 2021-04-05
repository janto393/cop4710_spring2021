import { useState } from "react";
import { UserInfoType } from "src/hooks/useStudUser";

// util imports
import buildpath from "../../Utils/buildpath";

// component imports
import EventCard from "./EventCard";
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

		// add the rso of the user if they are part of an RSO
		if (props.studUser.rsoID !== undefined || -1)
		{
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
		<>
			{events.map(EventCard)}
		</>
	);
}

export default EventList;
