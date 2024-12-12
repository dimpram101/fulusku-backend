import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth-service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.register(req.body);
      return res.status(201).json({
        message: "Account created",
        payload: {
          ...data
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const canInsertPin = await AuthService.checkLogin(req.body);
      return res.status(200).json({
        message: "Login successful",
        payload: {
          canInsertPin
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async insertPin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.insertPin(req.body);
      return res.status(200).json({
        message: "Pin inserted",
        payload: {
          ...data
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const data = await AuthService.getMe(id);

      return res.status(200).json({
        message: "Account found",
        payload: {
          ...data
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
