import "./index.css";

import React, { useEffect, useState } from "react";
import { Button, Card, Grid, Typography } from "@material-ui/core";
import { useLoadingUpdate } from "src/Context/LoadingProvider";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { ucfCoordinates, ufCoordinates } from "src/Utils/mapUtils";
import StarRatingComponent from "react-star-rating-component";
import { TextField } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import StudForm from "../StudForm";
import { FieldType } from "src/Utils/formUtils";
import { FormInputType } from "../LoginForm";
import produce from "immer";
import { CreateEventComment, DeleteEventCommentRequest, GetEventsRequest, RateEventRequest, UpdateEventCommentRequest } from "src/types/apiRequestBodies";
import { DefaultApiResponse, GetEventResponse } from "src/types/apiResponseBodies";
import buildpath from "../../Utils/buildpath";
import { Comment, Event } from "../../types/eventTypes";
import { Coordinates } from "src/types/dropDownTypes";

const Events: React.FC<any> = (props: any) => {
  const { studUser } = props;
  const [isEditingComment, setIsEditingComment] = useState(false);
	const [universityID, setUniversity] = useState<number>(studUser.universityID);

  const setIsLoading = useLoadingUpdate();
  const [rating, setRating] = useState(0);
  // TODO: DELETE MOCK EVENT
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setIsLoading(true);

    let payload: GetEventsRequest = {
    	universityID: universityID,
			includePrivate: (universityID === studUser.universityID),
			RSOs: ((universityID === studUser.universityID) ? studUser.RSOs : undefined)
    };

		let request: Object = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

		fetch(buildpath("/api/getEvents"), request)
		.then((response: Response): Promise<GetEventResponse> => {
			return response.json();
		})
		.then((data: GetEventResponse) => {
			if (!data.success)
			{
				console.error(data.error);
				return;
			}

			setEvents(data.events);
		});
  }, []);

  const getMap = (coordinates: Coordinates) => {
		const {latitude, longitude} = coordinates;

    return (
      <Grid container className="map-container">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          scrollWheelZoom={true}
          className="map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[latitude, longitude]} />
        </MapContainer>
      </Grid>
    );
  };

  const removeComment = (comment: Comment) => {
    let payload: DeleteEventCommentRequest = {
			commentID: comment.ID
		};

		let request: Object = {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			},
		};

		setIsLoading(true);
		fetch(buildpath("/api/deleteEventComment"), request)
		.then((response: Response): Promise<DefaultApiResponse> => {
			return response.json();
		})
		.then((data: DefaultApiResponse) => {
			if (!data.success)
			{
				console.error(data.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
		});
  };

  const editComment = (comment: Comment) => {
		setCommentUpdate(comment);
    setIsEditingComment(true);
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
              <Grid container item xs={9} direction="column">
                {/* user name */}
                <Grid item xs={4}>
                  <Typography variant="caption" id="comment-section-name">
                    {comment.author}
                  </Typography>
                </Grid>

                {/* comment */}
                <Grid item xs={7}>
                  <Typography variant="body1" id="comment-section-comment">
                    {comment.comment}
                  </Typography>
                </Grid>
              </Grid>

              {/* edit */}
              <Grid item xs={1}>
                <Button onClick={() => {
										editComment(comment);
									}}>
                  <EditIcon />
                </Button>
              </Grid>

              {/* delete */}
              <Grid item xs={1}>
                <Button onClick={() => {
										removeComment(comment)
									}}>
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          );
        })}
        <Grid item xs={12} className="comment-section-new">
          <TextField
            multiline
            label="comments"
            className="comments"
            onSubmit={() => {
							// let payload: CreateEventComment = {
							// 	userID: studUser.userID,
							// 	eventID: eventID,
							// 	comment: commentUpdate
							// };
					
							// let request: Object = {
							// 	method: "POST",
							// 	body: JSON.stringify(payload),
							// 	headers: {
							// 		"Content-Type": "application/json",
							// 	},
							// };
					
							// setIsLoading(true);
							// fetch(buildpath("/api/getEvents"), request)
							// .then((response: Response): Promise<GetEventResponse> => {
							// 	return response.json();
							// })
							// .then((data: GetEventResponse) => {
							// 	if (!data.success)
							// 	{
							// 		console.error(data.error);
							// 		setIsLoading(false);
							// 		return;
							// 	}
					
							// 	setIsLoading(false);
							// });
						}}
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

  const getEventHeader = (eventName: any, eventID: number) => {
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
              
							let payload: RateEventRequest = {
								userID: studUser.userID,
								eventID: eventID,
								rating: nextValue
							};

							let request: Object = {
								method: "POST",
								body: JSON.stringify(payload),
								headers: {
									"Content-Type": "application/json",
								},
							};

							setIsLoading(true);
							fetch(buildpath("/api/rateEvent"), request)
							.then((response: Response): Promise<DefaultApiResponse> => {
								return response.json();
							})
							.then((data: DefaultApiResponse) => {
								if (!data.success)
								{
									console.error(data.error);
									setIsLoading(false);
									return;
								}

								setIsLoading(false);
							});

              setRating(nextValue); // so the component knows what start to turn yellow
            }}
          />
        </Grid>
      </Grid>
    );
  };

  // this is the updated comment we need to send via api request
  const [commentUpdate, setCommentUpdate] = useState<Comment>({
		ID: -1,
		author: "",
		comment: "",
		timetag: new Date()
	});

  const handleChange = (field: string, update: FormInputType) => {
    setCommentUpdate({
			...commentUpdate,
			comment: update.value
		});
  };

  return (
    <>
      {events.map((event, index) => {
        const { ID, name, description, comments, coordinates } = event;

        return (
          <Grid item xs={10} className="event-card" key={index}>
            <Card raised>
              {/* event rating */}
              {getEventHeader(name, ID)}

              {/* map */}
              {getMap(coordinates)}

              {/* event description */}
              {getDescription(description)}

              {/* comments */}
              {getComments(comments)}
            </Card>
          </Grid>
        );
      })}
      <Dialog
        open={isEditingComment}
        onBackdropClick={() => setIsEditingComment(false)}
        className="edit-comment"
      >
        <StudForm
          title="Edit comment"
          formFields={[
            { fieldTitle: "comment", fieldType: FieldType.TEXT_FIELD },
          ]}
          buttonText="Submit"
          handleChange={handleChange}
          handleClick={() => {
						let payload: UpdateEventCommentRequest = {
							commentID: commentUpdate.ID,
							comment: commentUpdate.comment
						};
				
						let request: Object = {
							method: "POST",
							body: JSON.stringify(payload),
							headers: {
								"Content-Type": "application/json",
							},
						};
				
						setIsLoading(true);
						fetch(buildpath("/api/updateEventComment"), request)
						.then((response: Response): Promise<DefaultApiResponse> => {
							return response.json();
						})
						.then((data: DefaultApiResponse) => {
							if (!data.success)
							{
								console.error(data.error);
								setIsLoading(false);
								return;
							}
				
							setIsEditingComment(false);
							setIsLoading(false);
						});
					}}
        />
      </Dialog>
    </>
  );
};

export default Events;
