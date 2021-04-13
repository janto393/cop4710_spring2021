/**
 * Types pertaining to a Registered Student Organization
 */
export interface RSO
{
	ID: number,
	name: string,
	universityID: number
}

export interface MemberGroups
{
	recordID: number,
	userID: number,
	rsoID: number
}
