import { Router } from "express";
import { JWTMiddleware } from "../../middlewares";
import { NotificationController } from "./notification-controller";

const notificationRouter = Router();

notificationRouter.use(JWTMiddleware.verifyToken);
notificationRouter.get("/", NotificationController.getAllNotifications);

export default notificationRouter;
