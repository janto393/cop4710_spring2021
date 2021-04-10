import { Event } from "src/types/eventTypes";
import EventCards from "./EventCard";
import { GetEventResponse } from "src/types/apiResponseBodies";
import { GetEventsRequest } from "src/types/apiRequestBodies";
import { StudUser } from "src/hooks/useStudUser";
import buildpath from "../../Utils/buildpath";
import { useEffect } from "react";
import { useState } from "react";

// util imports

// component imports

export type EventListProps = {
  studUser: StudUser;
};

function EventList(props: EventListProps): JSX.Element {
  const { studUser } = props;
  const { universityID, rsoID } = studUser;

  const [events, setEvents] = useState<Array<Event>>([]);

  const fetchEvents = (): void => {
    let payload: GetEventsRequest = {
      schoolID: universityID,
    };

    console.log(studUser);
    console.log(typeof universityID);
    console.log(typeof rsoID);

    // hard code safety value (will remove when app is operational)
    if (universityID === undefined) {
      console.warn("schoolID safety value triggered");
      payload.schoolID = 1;
    }

    // add the rso of the user if they are part of an RSO
    if (rsoID !== undefined) {
      console.log("Populating rsoID");
      payload.rsoID = rsoID;
    }

    let request: Object = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(buildpath("/api/getEvents"), request)
      .then(
        (response: Response): Promise<GetEventResponse> => {
          return response.json();
        }
      )
      .then((data: GetEventResponse): void => {
        if (!data.success) {
          console.error(data.error);
          return;
        }

        setEvents(data.events);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return <EventCards events={events} />;
}

export default EventList;