import { NextFunction, Request, Response } from "express";
import { NotificationService } from "./notification-service";

export class NotificationController {
  static async getAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const { id } = req.user!;
      const { account_id } = req.query;
      const notifications = await NotificationService.getAllNotifications(
        // id as string
        account_id as string
      );
      return res.status(200).json({
        message: "All notifications",
        payload: {
          notifications
        }
      });
    } catch (error) {
      next(error);
    }
  }
}