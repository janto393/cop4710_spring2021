import "./index.css";

import React, { useEffect, useState } from "react";
import { Button, Card, Grid, Typography } from "@material-ui/core";
import { useLoadingUpdate } from "src/Context/LoadingProvider";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { ucfCoordinates, ufCoordinates } from "src/Utils/mapUtils";
import StarRatingComponent from "react-star-rating-component";
import { TextField } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

const Event: React.FC<any> = (props: any) => {
  const { studUser } = props;

  const setIsLoading = useLoadingUpdate();
  const [rating, setRating] = useState(0);
  // TODO: DELETE MOCK EVENT
  const [events, setEvents] = useState<Array<any>>([
    {
      eventName: "UCF Event!",
      eventDescription: "An event that's taking place here at this university.",
      comments: [
        { comment: "loved this event!", name: "Jamil Gonzalez" },
        { comment: "can't wait to go!", name: "Jon Alliot" },
        { comment: "will this event be streamed?", name: "Troy Perez" },
      ],
      coordinates: ucfCoordinates,
    },
  ]);

  useEffect(() => {
    setIsLoading(true);
    // here's where our GET /api/events should go
    setTimeout(() => {
      console.log("Events returned from api call...");
      setIsLoading(false);
    }, 2000);
  }, []);

  const getMap = (coordinates: any) => {
    return (
      <Grid container className="map-container">
        <MapContainer
          center={coordinates}
          zoom={15}
          scrollWheelZoom={true}
          className="map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coordinates} />
        </MapContainer>
      </Grid>
    );
  };

  // TODO: 1. update/delete comment
  const getComments = (comments: any) => {
    return (
      <Grid container direction="column" className="comment-section">
        <Grid item xs={12}>
          <Typography variant="h6">Comments</Typography>
        </Grid>

        <hr />

        {comments?.map((comment: any) => {
          return (
            <Grid container direction="row">
              {/* name */}
              <Grid item xs={1}>
                <PersonIcon />
              </Grid>
              <Grid container item xs={11} direction="column">
                <Grid item xs={4}>
                  <Typography variant="caption" id="comment-section-name">
                    {comment.name}
                  </Typography>
                </Grid>
                {/* comment */}
                <Grid item xs={8}>
                  <Typography variant="body1" id="comment-section-comment">
                    {comment.comment}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
        <Grid item xs={12} className="comment-section-new">
          <TextField
            multiline
            label="comments"
            className="comments"
            onChange={() =>
              console.log("send api request with payload and refetch")
            }
            variant="filled"
          />
        </Grid>
      </Grid>
    );
  };

  const getDescription = (eventDescription: any) => {
    return (
      <Grid item xs={12} className="event-description-item">
        <Typography variant="h6">Description</Typography>
        <Typography variant="body2">{eventDescription}</Typography>
      </Grid>
    );
  };

  const getEventHeader = (eventName: any) => {
    return (
      <Grid container direction="row">
        {/* event title */}
        <Grid item xs={9} className="event-title-item">
          <Typography variant="h4">{eventName}</Typography>
        </Grid>
        {/* ratings */}
        <Grid item xs={2} className="rating">
          <StarRatingComponent
            name="rate"
            starCount={5}
            value={rating}
            onStarClick={(nextValue) => {
              // send rating to backend
              setRating(nextValue); // so the component knows what start to turn yellow
            }}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      {events.map((event, index) => {
        const { eventName, eventDescription, comments, coordinates } = event;

        return (
          <Grid item xs={10} className="event-card" key={index}>
            <Card raised>
              {/* event rating */}
              {getEventHeader(eventName)}

              {/* map */}
              {getMap(coordinates)}

              {/* event description */}
              {getDescription(eventDescription)}

              {/* comments */}
              {getComments(comments)}
            </Card>
          </Grid>
        );
      })}
    </>
  );
};

export default Event;
