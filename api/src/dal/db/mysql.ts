import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entity/*.{ts,js}"],
  subscribers: [],
  migrations: [],
});
