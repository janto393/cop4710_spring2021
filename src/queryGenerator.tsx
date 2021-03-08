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

export enum OrderType
{
	ASC,
	DESC
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
	criteria: string,
	orderType: OrderType
};

export interface GroupByStatement
{
	criteria: string
};

export interface QueryGeneratorInput
{
	selectStatements: Array<SelectStatement>,
	fromStatements: Array<FromStatement>,
	whereStatements: Array<WhereStatement> | null,
	joinStatements: Array<JoinStatement> | null,
	orderStatements: OrderStatement | null,
	groupByStatements: GroupByStatement | null
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


	//////////////////
	// WHERE CLAUSE //
	//////////////////

	if (input.whereStatements !== null)
	{
		let whereClause: string = "WHERE\n";

		// combine the where elements
		for (let i: number = 0; i < input.whereStatements.length; i++)
		{
			// insert a tab before each criteria to make query more readable
			whereClause.concat("	");

			whereClause.concat(input.whereStatements[i].criteria);

			if (i === input.whereStatements.length - 1)
			{
				whereClause.concat("\n");
			}
			else
			{
				whereClause.concat(",\n");
			}
		}

		// join the where clause to the query string
		generatedQuery.query.concat(whereClause);
	}


	/////////////////
	// JOIN CLAUSE //
	/////////////////

	if (input.joinStatements !== null)
	{
		let joinClause: string = "";

		// combine the join statements
		for (let i: number = 0; i < input.joinStatements.length; i++)
		{
			// insert the join text depending on the join type
			switch (input.joinStatements[i].joinType)
			{
				case JoinType.INNER_JOIN:
				{
					joinClause.concat("INNER JOIN ");
					break;
				}
				case JoinType.LEFT_JOIN:
				{
					joinClause.concat("LEFT JOIN ");
					break;
				}
				case JoinType.RIGHT_JOIN:
				{
					joinClause.concat("RIGHT JOIN ");
					break;
				}
				case JoinType.OUTER_JOIN:
				{
					joinClause.concat("OUTER JOIN ");
					break;
				}
				default:
				{
					generatedQuery.error = "Invalid join type: " + input.joinStatements[i].joinType;
					return generatedQuery;
				}
			}

			// insert the table name to be joined on the current line
			joinClause.concat(input.joinStatements[i].tableName);
			joinClause.concat(" ON " + input.joinStatements[i].criteria + "\n");
		}

		// join the join clause to the query string
		generatedQuery.query.concat(joinClause);
	}


	//////////////////
	// ORDER CLAUSE //
	//////////////////


	if (input.orderStatements !== null)
	{
		let orderClause: string = "ORDER BY ";

		orderClause.concat(input.orderStatements.criteria + " ");

		switch (input.orderStatements.orderType)
		{
			case (OrderType.ASC):
			{
				orderClause.concat("ASC");
				break;
			}
			case (OrderType.DESC):
			{
				orderClause.concat("DESC");
				break;
			}
			default:
			{
				generatedQuery.error = "Invalid order type";
				return generatedQuery;
			}
		}

		orderClause.concat("\n");

		// add the order clause to the query string
		generatedQuery.query.concat(orderClause);
	}


	/////////////////////
	// Group By Clause //
	/////////////////////

	if (input.groupByStatements !== null)
	{
		let groupClause: string = "GROUP BY ";

		groupClause.concat(input.groupByStatements.criteria + "\n");

		generatedQuery.query.concat(groupClause);
	}
	

	generatedQuery.success = true;
	return generatedQuery;
}
