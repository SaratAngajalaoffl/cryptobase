export type AppConfig = {
  configDir: string;
  dbUrl: string;
  apiPort: number;
};

class App {
  config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  initDb() {}

  initAPI() {}

  startAdminPanel() {}
}
