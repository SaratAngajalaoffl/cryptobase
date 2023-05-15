import { Router } from "express";

const repositoryRouter = Router();

repositoryRouter.get("/respositories", () => {});
repositoryRouter.post("/respositories", () => {});

repositoryRouter.get("/respositories/:repository_id", () => {});
repositoryRouter.post("/respositories/:repository_id", () => {});
repositoryRouter.put("/respositories/:repository_id", () => {});
repositoryRouter.delete("/respositories/:repository_id", () => {});

export default repositoryRouter;
