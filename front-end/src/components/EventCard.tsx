import React, { useEffect } from "react";

// bootstrap imports
import { Accordion, Button, Card, Image } from "react-bootstrap";

// utility imports
import { decode, encode, EncodeOptions } from "node-base64-image";

interface EventPicture
{
	ID: number,
	picture: Buffer,
	position: number
}

/**
 * Information for the event to be populated in the card
 */
export interface EventInfo
{
	index: number, // used to assign keys to elements
	schoolID: number,
	address: string,
	city: string,
	state: {
		ID: number,
		name: string,
		acronym: string
	},
	zip: string,
	rso: {
		ID: number,
		name: string
	},
	meetingType: {
		ID: number,
		name: string
	},
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number,
	eventPictures: Array<EventPicture>
}

/**
 * Card-based component that shows a preview of the event when collapsed and full
 * event information when expanded.
 * 
 * Meant to be used in an Accordian Container Element
 */
function EventCard(props: EventInfo, index: number)
{

	return (
		<Card className="eventCard">
			Test
			{/* <Card.Img src={props.eventPictures[0].toString("base64")} alt="Event Image" />
			<Card.Header>
				<Accordion.Toggle as={Button} variant="link" eventKey={String(props.eventInfo.eventIndex)}>
				</Accordion.Toggle>
			</Card.Header> */}
		</Card>
	);
}

export default EventCard;
