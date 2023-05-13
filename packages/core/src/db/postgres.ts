import { Pool } from "pg";
import { DataSource } from "typeorm";

import { ColumnConfig, Database, PostgresDatabaseConfig } from "./db";

const DEFAULT_CONFIG: PostgresDatabaseConfig = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "test",
  synchronize: true,
  logging: false,
};

export class PostgresDatabase extends Database {
  private connection: DataSource;
  private pool: Pool;

  constructor(databaseConfig: PostgresDatabaseConfig) {
    super();

    this.pool = new Pool({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.username,
      password: databaseConfig.password,
    });

    const config = {
      ...databaseConfig,
      pool: this.pool,
    };

    this.connection = new DataSource(config);
  }

  private createDbIfDoesntExist = async (database: string) => {
    // Use the connection pool to create the database if it doesn't exist
    try {
      await this.pool.query(`CREATE DATABASE ${database};`);
    } catch (err) {
      console.log(`Db '${database}' already exists`);
    }
  };

  public static createConnection = async (config?: PostgresDatabaseConfig) => {
    const dbConf = config || DEFAULT_CONFIG;

    const db = new PostgresDatabase(dbConf);

    await db.createDbIfDoesntExist(dbConf.database);

    db.connection = await db.connection.initialize();

    return db;
  };

  // TODO: check if table already exists before creating
  createTable = async (tableName: string) => {
    // get the entity manager
    const entityManager = this.connection.manager;

    try {
      await entityManager.query(`CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY);`);
    } catch (err) {
      // console.log(err);
    }
  };

  addColumn = async (tableName: string, column: ColumnConfig) => {
    // get the entity manager
    const entityManager = this.connection.manager;

    const columnDefinition = this.getColumnDefinition(column);

    const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`;

    // create a new entity dynamically
    try {
      await entityManager.query(query);
    } catch (err) {}
  };

  close = async () => {
    this.connection.destroy();
  };

  private getColumnDefinition = (column: ColumnConfig) => {
    return `${column.name} ${this.getCorrespondingDataTypeForKey(column.type)} ${column.strictNoNull ? "NOT NULL" : ""}`;
  };

  private getCorrespondingDataTypeForKey = (key: string) => {
    switch (key) {
      case "string":
        return "VARCHAR(50)";
      case "number":
        return "INT";
      default:
        throw Error("Type not valid!");
    }
  };
}
