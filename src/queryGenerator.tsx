export interface GeneratedQuery
{
	success: Boolean,
	query: string,
	error: string
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
	columnName: string
};

export interface FromStatement
{
	tableName: string
};

export interface WhereStatement
{
	criteria: string
};

export interface JoinStatement
{
	tableName: string,
	joinType: JoinType,
	criteria: string
};

export interface OrderStatement
{
	criteria: string
};

export interface GroupByStatement
{
	criteria: string
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
	let generatedQuery: GeneratedQuery = {
		success: false,
		query: "",
		error: ""
	};


	///////////////////
	// SELECT CLAUSE //
	///////////////////

	let selectClause: string = "SELECT ";

	// ensure there is at least 1 select element
	if (input.selectStatements.length < 1)
	{
		generatedQuery.error = "No SELECT elements specified";
		return generatedQuery;
	}

	// combine the select elements
	for (let i: number = 0; i < input.selectStatements.length; i++)
	{
		selectClause.concat(input.selectStatements[i].columnName);
		
		if (i === input.selectStatements.length - 1)
		{
			selectClause.concat("\n");
		}
		else
		{
			selectClause.concat(", ");
		}
	}

	// join the select statement to the query string
	generatedQuery.query.concat(selectClause);


	/////////////////
	// FROM CLAUSE //
	/////////////////

	let fromClause: string = "FROM ";

	// ensure there is at least 1 from element
	if (input.fromStatements.length < 1)
	{
		generatedQuery.error = "No FROM elements specified";
		return generatedQuery;
	}

	// combine the from elements
	for (let i: number = 0; i < input.fromStatements.length; i++)
	{
		fromClause.concat(input.fromStatements[i].tableName);

		if (i === input.fromStatements.length - 1)
		{
			fromClause.concat("\n");
		}
		else
		{
			fromClause.concat(", ");
		}
	}

	// join the from clause to the query string
	generatedQuery.query.concat(fromClause);

	generatedQuery.success = true;
	return generatedQuery;
}
