import { Router } from "express";
import { NotificationController } from "./notification-controller";

const notificationRouter = Router();

notificationRouter.get("/", NotificationController.getAllNotifications);

export default notificationRouter;
