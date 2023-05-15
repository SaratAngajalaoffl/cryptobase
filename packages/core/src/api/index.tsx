import express from "express";
import cors from "cors";
import repositoryRouter from "./reposioryRouter";

const API_PORT = process.env.API_PORT || 8080;

const app = express();

app.use(cors());

app.use(repositoryRouter);

app.listen(API_PORT, () => {
  console.log(`API running on port ${API_PORT}`);
});
