/**
 * If an endpoint request body is not explicitly defined, then it
 * does not require a request body.
 */

import { RSO } from "./dropDownTypes";

type rsoID = number;
type isApproved = boolean;
export interface approveDenyRSOsRequest {
	RSOs: Array<[rsoID, isApproved]>
}

export interface CreateAttendeeRequest {
  userID: number;
  eventID: number;
}

export interface CreateEventRequest {
  schoolID: number;
  address: string;
  city: string;
  stateID: number;
  zip: string;
  rsoID: number;
  meetingTypeID: number;
  name: string;
  description: string;
  room: string;
  rating: number;
  isPublic: boolean;
  numAttendees: number;
  capacity: number;
  eventPictures: Array<Buffer>;
}

export interface CreateEventComment {
  comment: string;
  userID: number;
  eventID: number;
}

export interface CreateMeetingTypeRequest {
  name: string;
}

export interface CreateRsoRequest {
  name: string;
  universityID: number;
}

export interface CreateUniversityRequest
{
	name: string,
	address: string,
	city: string,
	stateID: number,
	zip: string,
	description: string,
	phoneNumber: string,
	email: string,
	campusPictures: string[]
}

export interface DeleteAttendeeRequest {
  userID: number;
  eventID: number;
}

export interface DeleteEventRequest {
  eventID: number;
}

export interface DeleteEventCommentRequest {
  commentID: number;
}

export interface DeleteRsoRequest {
  rsoID: number
}

export interface GetEventsRequest {
  universityID: number;
  includePrivate: boolean;
  RSOs?: RSO[];
}

export interface GetRsoRequest {
	universityID: number,
	getApproved: boolean,
  rsoID?: number,
  name?: string
}

export interface GetUniversitiesRequest {
  universityID?: number;
}

export interface JoinRsoRequest {
	userID: number,
	universityID: number,
	rsoID: number
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LeaveRsoRequest {
	userID: number,
	rsoID: number
}

export interface RateEventRequest {
  userID: number;
  eventID: number;
  rating: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstname: string;
  email: string;
  universityID: number;
  rsoID: number;
  role: number;
  profilePicture?: Buffer;
}

export interface UpdateEventRequest {
  eventID: number;
  schoolID?: number;
  stateID?: number;
  rsoID?: number;
  meetingType?: number;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  zip?: string;
  room?: string;
  isPublic?: boolean;
  capacity?: number;
}

export interface UpdateEventCommentRequest {
  commentID: number;
  comment: string;
}

export interface UpdateRsoRequest {
  rsoID: number;
  name: string;
}

export interface UpdateUserRequest {
  firstname?: string;
  lastname?: string;
  password?: string;
  email?: string;
  universityID?: number;
  rsoID?: number;
  role?: number;
  profilePicture?: Buffer;
}
