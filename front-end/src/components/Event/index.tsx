import "./index.css";

import React, { useEffect, useState } from "react";
import { Card, Grid, Typography } from "@material-ui/core";
import { useLoadingUpdate } from "src/Context/LoadingProvider";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { ucfCoordinates } from "src/Utils/mapUtils";

export type EventType = {
  eventID?: number;
  schoolID?: number;
  rsoID?: number;
  rsoName?: string;
  meetingTypeID?: number;
  meetingTypeName?: string;
  eventName?: string;
  eventDescription?: string;
  eventAddress?: string;
  eventCity?: string;
  stateID?: number;
  stateName?: string;
  stateAcronym?: string;
  eventZip?: string;
  eventRoom?: string;
  eventRating?: number;
  isPublic?: boolean;
  numAttendees?: number;
  eventCapacity?: number;
  eventComment?: string;
  commentTimetag?: Date;
  commenterFirstname?: string;
  commenterLastname?: string;
};

const Event: React.FC<any> = () => {
  const [events, setEvents] = useState<Array<EventType>>([
    {
      eventName: "UCF Event!",
      eventDescription: "An event that's taking place here at this university.",
    },
  ]);
  const setIsLoading = useLoadingUpdate();

  useEffect(() => {
    setIsLoading(true);
    // here's where our GET /api/events should go
    setTimeout(() => {
      console.log("Events returned from api call...");
      setIsLoading(false);
    }, 2000);
  }, []);

  const getMap = (
    <MapContainer
      center={ucfCoordinates}
      zoom={15}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={ucfCoordinates} />
    </MapContainer>
  );

  return (
    <Grid container direction="column" className="event-card-container">
      {events.map((event) => {
        const { eventName, eventDescription } = event;

        return (
          <Grid item xs={8}>
            <Card raised>
              {/* event title */}
              <Grid item xs={12}>
                <Typography variant="h4">{eventName}</Typography>
              </Grid>

              {/* event map */}
              <Grid container className="map-container">
                {getMap}
              </Grid>

              {/* event description */}
              <Grid item xs={12}>
                <Typography variant="body1">{eventDescription}</Typography>
              </Grid>

              {/* sub to event/comment on event/rate event buttons */}
              <Grid item xs={3}>
                COMMENT
              </Grid>

              <Grid item xs={3}>
                RATE
              </Grid>

              <Grid item xs={3}>
                SUBSCRIBE TO EVENT
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Event;
