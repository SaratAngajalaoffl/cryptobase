export type ColumnConfig = {
  name: string;
  type: "string" | "number";
  strictNoNull?: boolean;
};

export abstract class Database {
  static createConnection: () => Promise<Database>;

  abstract createTable: (tableName: string) => Promise<void>;

  abstract addColumn: (
    tableName: string,
    column: ColumnConfig
  ) => Promise<void>;

  abstract close: () => Promise<void>;
}

export type PostgresDatabaseConfig = {
  type: "postgres";
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
};
