import express, { Express } from "express";
import apiV1 from "./api/v1";
import dotenv from "dotenv";
import { errorHandler } from "./utils/middlewares";

dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());

app.use("/api/v1/", apiV1);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`[server]: Server is running at port:${port}`);
});

export default app;