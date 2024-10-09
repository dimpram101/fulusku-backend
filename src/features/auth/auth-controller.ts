import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth-service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await AuthService.register(req.body);
      res.status(201).json({
        message: "Account created",
        payload: {
          account
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
