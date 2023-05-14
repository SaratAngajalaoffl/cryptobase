import { ColumnConfig, PostgresDatabaseConfig } from "./db";
import { PostgresDatabase } from "./postgres";

describe("Database Connection", () => {
  const databaseConfig: PostgresDatabaseConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "connection_test",
    synchronize: true,
    logging: false,
  };

  let database: PostgresDatabase;

  beforeEach(async () => {
    const db = new PostgresDatabase(databaseConfig);

    try {
      await db.pool.query(`DROP DATABASE ${databaseConfig.database};`);
    } catch (err) {}
  });

  afterEach(async () => {
    //     await database.close();
  });

  it("Database creation works", async () => {
    database = await PostgresDatabase.createConnection(databaseConfig);
  });
});

describe("createTable", () => {
  const databaseConfig: PostgresDatabaseConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "table_test",
    synchronize: true,
    logging: false,
  };

  let database: PostgresDatabase;

  beforeAll(async () => {
    const db = new PostgresDatabase(databaseConfig);

    try {
      await db.pool.query(`DROP DATABASE ${databaseConfig.database};`);
    } catch (err) {}

    database = await PostgresDatabase.createConnection(databaseConfig);
  });

  afterAll(async () => {
       await database.close();
  });

  it("creates a new table", async () => {
    const tableName = "mytable";
    await database.createTable(tableName);
  });
});

describe("addColumn", () => {
  const databaseConfig: PostgresDatabaseConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "column_test",
    synchronize: true,
    logging: false,
  };

  let database: PostgresDatabase;
  const tableName = "mytable";

  beforeAll(async () => {
    const db = new PostgresDatabase(databaseConfig);

    try {
      await db.pool.query(`DROP DATABASE ${databaseConfig.database};`);
    } catch (err) {}

    database = await PostgresDatabase.createConnection(databaseConfig);

    await database.createTable(tableName);
  });

  afterAll(async () => {
     await database.close();
     await database.pool.query(`DROP DATABASE ${databaseConfig.database}`);
  });

  it("Adds new column to a table", async () => {
    const column: ColumnConfig = {
      name: "test_col",
      type: "string",
      strictNoNull: true,
    };

    await database.addColumn(tableName, column);
  });
});
