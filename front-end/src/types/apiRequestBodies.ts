/**
 * If an endpoint request body is not explicitly defined, then it
 * does not require a request body.
 */

export interface CreateAttendeeRequest
{
	userID: number,
	eventID: number
}

export interface CreateEventRequest
{
	schoolID: number,
	address: string,
	city: string,
	stateID: number,
	zip: string
	rsoID: number,
	meetingTypeID: number
	name: string,
	description: string,
	room: string,
	rating: number,
	isPublic: boolean,
	numAttendees: number,
	capacity: number,
	eventPictures: Array<Buffer>
}

export interface CreateMeetingTypeRequest
{
	name: string
}

export interface CreateRsoRequest
{
	name: string,
	universityID: number
}

export interface DeleteAttendeeRequest
{
	userID: number,
	eventID: number
}

export interface DeleteEventRequest
{
	eventID: number
}

export interface DeleteRsoRequest
{
	rsoID: number
}

export interface GetEventsRequest
{
	universityID: number,
	includePrivate: boolean,
	rsoID?: number
}

export interface GetRsoRequest
{
	rsoID?: number,
	name?: string,
	universityID: number
}

export interface GetUniversitiesRequest
{
	universityID?: number
}

export interface LoginRequest
{
	username: string,
	password: string
}

export interface RegisterRequest
{
	username: string,
	password: string,
	firstname: string,
	email: string,
	universityID: number,
	rsoID: number,
	role: number,
	profilePicture?: Buffer
}

export interface UpdateEventRequest
{
	eventID: number,
	schoolID?: number,
	stateID?: number,
	rsoID?: number,
	meetingType?: number,
	name?: string,
	description?: string,
	address?: string,
	city?: string,
	zip?: string,
	room?: string,
	isPublic?: boolean,
	capacity?: number
}

export interface UpdateRsoRequest
{
	rsoID: number,
	name: string
}

export interface UpdateUserRequest
{
	firstname?: string,
	lastname?: string,
	password?: string,
	email?: string,
	universityID?: number,
	rsoID?: number,
	role?: number,
	profilePicture?: Buffer
}
