export interface GeneratedQuery
{
	success: Boolean,
	query: String
};

export enum JoinType
{
	INNER_JOIN,
	LEFT_JOIN,
	RIGHT_JOIN,
	OUTER_JOIN
};

export interface SelectStatement
{
	columnName: String
};

export interface FromStatement
{
	tableName: String
};

export interface WhereStatement
{
	criteria: String
};

export interface JoinStatement
{
	tableName: String,
	joinType: JoinType,
	criteria: String
};

export interface OrderStatement
{
	criteria: String
};

export interface GroupByStatement
{
	criteria: String
};

export interface QueryGeneratorInput
{
	selectStatements: Array<SelectStatement>,
	fromStatements: Array<FromStatement>,
	whereStatements: Array<WhereStatement>,
	joinStatements: Array<JoinStatement>,
	orderStatements: Array<OrderStatement>,
	groupByStatements: Array<GroupByStatement>
};

export function queryGenerator(input: QueryGeneratorInput)
{

}
