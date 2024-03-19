import { Router } from "express";
import eventsController from "./events-controller";

const router = Router();

router.use("/event", eventsController);

export default router;