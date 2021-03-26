import {queryGenerator} from '../src/queryGenerator';
import {QueryGeneratorInput} from '../src/queryGenerator';
import {GeneratedQuery} from '../src/queryGenerator';
import {SelectStatement} from '../src/queryGenerator';
import {FromStatement} from '../src/queryGenerator';
import {WhereStatement} from '../src/queryGenerator';
import { expect } from 'chai';
import 'mocha';
import { isMainThread } from 'node:worker_threads';


describe('queryGenerator function', () => {

	// testing when you input an empty SelectStatments and empty fromStatments
	it('should return No SELECT elements specified', () => {
		let testQ: QueryGeneratorInput = 
		{
			selectStatements: [],
			fromStatements: [],
			whereStatements: null,
			joinStatements:  null,
			orderStatements: null,
			groupByStatements: null
		}

		let result : GeneratedQuery = queryGenerator(testQ);

		
		expect(result.error).to.be.a('String');
		expect(result.error).to.be.eq('No SELECT or FROM elements specified');
		expect(result.success).to.be.a('boolean');
		expect(result.success).to.be.eq(false);

	});

	// testing when you input an empty SelectStatments 
	it('should return No SELECT elements specified', () => {
		let from1: FromStatement =
		{
			tableName: 'From'
		}
		let from2: FromStatement =
		{
			tableName: 'Florida'
		}
		let testQ: QueryGeneratorInput = 
		{
			selectStatements: [],
			fromStatements: [from1, from2],
			whereStatements: null,
			joinStatements:  null,
			orderStatements: null,
			groupByStatements: null
		}

		let result : GeneratedQuery = queryGenerator(testQ);

		
		expect(result.error).to.be.a('String');
		expect(result.error).to.be.eq('No SELECT elements specified');
		expect(result.success).to.be.a('boolean');
		expect(result.success).to.be.eq(false);

	});

	// testing when you input an empty fromStatments
	it('should return No FROM elements specified', () => {
		let sel1: SelectStatement =
		{
			columnName: 'Hello'
		}
		let sel2: SelectStatement = 
		{
			columnName: 'World'
		}
		let testQ: QueryGeneratorInput = 
		{
			selectStatements: [sel1, sel2],
			fromStatements: [],
			whereStatements: null,
			joinStatements:  null,
			orderStatements: null,
			groupByStatements: null
		}

		let result : GeneratedQuery = queryGenerator(testQ);

		
		expect(result.error).to.be.a('String');
		expect(result.error).to.be.eq('No FROM elements specified');
		expect(result.success).to.be.a('boolean');
		expect(result.success).to.be.eq(false);

	});

	// testing when you input somthing into Selcet and From but noting else
	it('should return No FROM elements specified', () => {
		let from1: FromStatement = 
		{
			tableName: 'From'
		}
		let from2: FromStatement =
		{
			tableName: 'Florida'
		}
		let sel1: SelectStatement =
		{
			columnName: 'Hello'
		}
		let sel2: SelectStatement = 
		{
			columnName: 'World'
		}
		let testQ: QueryGeneratorInput = 
		{
			selectStatements: [sel1, sel2],
			fromStatements: [from1, from2],
			whereStatements: null,
			joinStatements:  null,
			orderStatements: null,
			groupByStatements: null
		}

		let result : GeneratedQuery = queryGenerator(testQ);

		
		expect(result.error).to.be.a('String');
		expect(result.error).to.be.eq('');
		expect(result.query).to.be.a('String');
		expect(result.query).to.be.eq('SELECT Hello, World\nFROM From, Florida\n');
		expect(result.success).to.be.a('boolean');
		expect(result.success).to.be.eq(true);

	});

	// testing when you input somthing into Selcet, From and where 
	it('should return No FROM elements specified', () => {
		let from1: FromStatement = 
		{
			tableName: 'From'
		}
		let from2: FromStatement =
		{
			tableName: 'Florida'
		}
		let sel1: SelectStatement =
		{
			columnName: 'Hello'
		}
		let sel2: SelectStatement = 
		{
			columnName: 'World'
		}
		let w1: WhereStatement = 
		{
			criteria: 'poop'
		}
		let testQ: QueryGeneratorInput = 
		{
			selectStatements: [sel1, sel2],
			fromStatements: [from1, from2],
			whereStatements: [w1],
			joinStatements:  null,
			orderStatements: null,
			groupByStatements: null
		}
		let result : GeneratedQuery = queryGenerator(testQ);
		
		expect(result.error).to.be.a('String');
		expect(result.error).to.be.eq('');
		expect(result.query).to.be.a('String');
		expect(result.query).to.be.eq('SELECT Hello, World\nFROM From, Florida\nWHERE\n	');
		expect(result.success).to.be.a('boolean');
		expect(result.success).to.be.eq(true);

	});

	it('should return No FROM elements specified', () => {
		let from1: FromStatement = 
		{
			tableName: 'From'
		}
		let from2: FromStatement =
		{
			tableName: 'Florida'
		}
		let sel1: SelectStatement =
		{
			columnName: 'Hello'
		}
		let sel2: SelectStatement = 
		{
			columnName: 'World'
		}
		let testQ: QueryGeneratorInput = 
		{
			selectStatements: [sel1, sel2],
			fromStatements: [from1, from2],
			whereStatements: null,
			joinStatements:  null,
			orderStatements: null,
			groupByStatements: null
		}
		let result : GeneratedQuery = queryGenerator(testQ);
		
		expect(result.error).to.be.a('String');
		expect(result.error).to.be.eq('');
		expect(result.query).to.be.a('String');
		expect(result.query).to.be.eq('SELECT Hello, World\nFROM From, Florida\n');
		expect(result.success).to.be.a('boolean');
		expect(result.success).to.be.eq(true);

	});


});