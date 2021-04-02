import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

// Component imports
import EventCard, { EventInfo } from "../components/EventCard";

// Utils imports
import buildpath from "../Utils/buildpath";

interface GetEventsPayload
{
	schoolID: number,
	rsoID: number
}

interface GetEventsResponse
{
	success: boolean,
	error: string,
	events: Array<EventInfo>
}

const EventsPage = () =>
{
	const [events, setEvents] = useState<Array<EventInfo>>([]);
	const [eventsFetched, setEventsFetched] = useState<boolean>(false);

	if (!eventsFetched)
	{
		// TODO Implement dynamic selection of payload values
		let payload: GetEventsPayload = {
			schoolID: 1,
			rsoID: 1
		};

		let request: Object = {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type" : "application/json"
			}
		};

		fetch(buildpath("/api/getEvents"), request)
			.then((response: Response) => {
				return response.json();
			})
			.then((data: GetEventsResponse) => {
				if (!data.success)
				{
					console.log(data.error);
					return;
				}

				setEvents(data.events);
				setEventsFetched(true);
			});
	};

	return (
		<>
			<Accordion>
				{events.map(EventCard)}
			</Accordion>
		</>
	);
}

export default EventsPage;
