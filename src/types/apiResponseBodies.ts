import { MeetingType, RSO, State } from "./dropDownTypes";
import { Event } from "./eventTypes";
import { MysqlError } from "mysql";
import { UserDataWithoutPassword } from "./userTypes";

/**
 * Default fields that are always returned with any ApiEndpoint
 * 
 * If an endpoint is not explicitly defined in this file, it means
 * that the endpoint only returns the fields that are in this
 * default response.
 */
export interface DefaultApiResponse
{
	readonly success: boolean,
	readonly error: MysqlError | string
}

export interface CreateMeetingTypeResponse extends DefaultApiResponse
{
	readonly meetingType: MeetingType
}

export interface CreateRsoReponse extends DefaultApiResponse
{
	readonly rsoData: RSO
}

export interface GetEventResponse extends DefaultApiResponse
{
	readonly events: Array<Event>
}

export interface GetMeetingTypesResponse extends DefaultApiResponse
{
	readonly meetingTypes: Array<MeetingType>
}

export interface GetRsoResponse extends DefaultApiResponse
{
	readonly RSOs: Array<RSO>
}

export interface GetStatesResponse extends DefaultApiResponse
{
	readonly states: Array<State>
}

export interface LoginResponse extends DefaultApiResponse
{
	readonly userData: UserDataWithoutPassword
}

export interface UpdateUserResponse extends DefaultApiResponse
{
	readonly newUserData: UserDataWithoutPassword
}
