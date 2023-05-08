import { ColumnConfig, PostgresDatabaseConfig } from "./db";
import { PostgresDatabase } from "./postgres";

describe("PostgresDatabase", () => {
  const databaseConfig: PostgresDatabaseConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "test",
    synchronize: true,
    logging: false,
  };

  let database: PostgresDatabase;

  beforeAll(async () => {
    database = await PostgresDatabase.createConnection(databaseConfig);
  });

  afterAll(async () => {
    await database.close();
  });

  describe("createTable", () => {
    it("creates a new table", async () => {
      const tableName = "mytable";
      await database.createTable(tableName);
    });
  });

  describe("addColumn", () => {
    it("Adds new column to a table", async () => {
      const tableName = "mytable";

      const column: ColumnConfig = {
        name: "name",
        type: "string",
        strictNoNull: true,
      };

      await database.addColumn(tableName, column);
    });
  });
});
