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

function EventsPage()
{
	const [events, setEvents] = useState<Array<EventInfo>>([]);

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

	console.log("FUCK");
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
		});

	return (
		<div className="EventsPage">
			<p>
				Hello, world
			</p>
			<Accordion>
				{events.map(EventCard)}
			</Accordion>
		</div>
	);
}

export default EventsPage;
