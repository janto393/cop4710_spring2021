import { useEffect } from "react";
import { useState } from "react";
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

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () =>	{
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

		setEvents((await (await fetch(buildpath("/api/getEvents"), request)).json()).events);
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
