function generateSqlQuery(selectStatements, fromStatements, whereStatements, joinStatements, orderStatements, groupByStatements)
{
	/*
		Incoming:
		{
			selectStatements : array {
				columnName : string
			},
			fromStatements : array {
				tableName : string
			},
			whereStatements : array {
				statement : string
			},
			joinStatements : array {
				tableName : string,
				joinType : string,
				criteria : string
			},
			orderStatements : array {
				criteria : string
			},
			groupByStatements : array {
				criteria : string
			}
		}
	*/

	let returnPackage = {
		success: false,
		query: ''
	};

	let queryString = '';

	// parse select clauses
	let selectClause = 'SELECT '

	// select everything if nothing was specified
	if (selectStatements.length === 0)
	{
		selectClause += '*\n';
	}
	else
	{
		for (let i = 0; i < selectStatements.length; i++)
		{
			selectClause += selectStatements[i].columnName;

			// insert a comma and a space if not the last element
			if (i < selectStatements.length - 1)
			{
				selectClause += ', ';
			}
		}

		// terminate clause with newline to make full query more readable
		selectClause += '\n';
	}

	// parse from clauses
	let fromClause = 'FROM '

	// return an error if nothing was specified in the from clause
	if (fromStatements.length === 0)
	{
		return returnPackage;
	}
	else
	{
		for (i = 0; i < fromStatements.length; i++)
		{
			fromClause += fromStatements[i];

			// insert a comma and a space if not the last element
			if (i < fromStatements.length - 1)
			{
				fromClause += ', ';
			}
		}

		// terminate clause with newline to make full query more readable
		fromClause += '\n';
	}

	// parse where clauses
	let whereClause = 'WHERE';
}

export default sqlParser;
