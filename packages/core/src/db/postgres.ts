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
  public pool: Pool;
  public config: PostgresDatabaseConfig;

  constructor(databaseConfig: PostgresDatabaseConfig) {
    super();

    this.config = databaseConfig;

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
    try {
      await this.pool.query(`CREATE DATABASE ${database};`);
    } catch (err) {
      console.log(`Db '${database}' already exists`);
    }
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

  // Establishes a new connection to the database using the given config. If the database doesn't exist, it create one
  public static createConnection = async (config?: PostgresDatabaseConfig) => {
    const dbConf = config || DEFAULT_CONFIG;

    const db = new PostgresDatabase(dbConf);

    await db.createDbIfDoesntExist(dbConf.database);

    db.connection = await db.connection.initialize();

    return db;
  };

  // Creates a table on the current connection. If table already exists, throws an error
  createTable = async (tableName: string) => {
    try {
      const entityManager = this.connection.manager;

      await entityManager.query(`CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY);`);
    } catch (err) {
      throw new Error(`Table '${tableName}' already exists`);
    }
  };

  addColumn = async (tableName: string, column: ColumnConfig) => {
    // get the entity manager
    const entityManager = this.connection.manager;

    const columnDefinition = this.getColumnDefinition(column);

    const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`;

    // create a new entity dynamically
    await entityManager.query(query);
  };

  close = async () => {
    this.connection.destroy();
  };
}
