import "./index.css";

import React, { useEffect, useState } from "react";
import { Button, Card, Grid, Typography } from "@material-ui/core";
import { useLoadingUpdate } from "src/Context/LoadingProvider";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { ucfCoordinates } from "src/Utils/mapUtils";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { ThumbDown } from "@material-ui/icons";
import CommentIcon from "@material-ui/icons/Comment";
import GradeIcon from "@material-ui/icons/Grade";
import StarRatingComponent from "react-star-rating-component";

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
  const [rating, setRating] = useState(0);

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
    <>
      {events.map((event, index) => {
        const { eventName, eventDescription } = event;

        return (
          <Grid item xs={8} className="event-card" key={index}>
            <Card raised>
              {/* event title */}
              <Grid item xs={12} className="event-title-item">
                <Typography variant="h4">{eventName}</Typography>
              </Grid>

              {/* event map */}
              <Grid container className="map-container">
                {getMap}
              </Grid>

              {/* event description */}
              <Grid item xs={12} className="event-description-item">
                <Typography variant="body1">{eventDescription}</Typography>
              </Grid>

              {/* comments could go here */}

              {/* event buttons */}
              <Grid
                container
                direction="row"
                justify="flex-end"
                className="event-card-buttons-container"
              >
                <Grid item xs={2} className="event-button">
                  <Button onClick={() => console.log("comment!")}>
                    <CommentIcon />
                  </Button>
                </Grid>

                <Grid item xs={2}>
                  <StarRatingComponent
                    name="rate"
                    starCount={5}
                    value={rating}
                    onStarClick={(nextValue) => setRating(nextValue)}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </>
  );
};

export default Event;
