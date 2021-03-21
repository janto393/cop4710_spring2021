import * as mysql from "mysql";

export default function configureSqlConnection(): mysql.ConnectionConfig
{
	const sqlConfiguration: mysql.ConnectionConfig = {
		host: process.env.RDS_HOSTNAME,
		user: process.env.RDS_USERNAME,
		password: process.env.RDS_PASSWORD,
		port: Number(process.env.RDS_PORT),
		database: "event_manager"
	};

	return sqlConfiguration
}
