import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse, UserToken } from "../models";

export class JWTMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ErrorResponse("Unauthorized", 401, ["token"], "UNAUTHORIZED");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded as UserToken;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async isAboveLevel9(req: Request, _res: Response, next: NextFunction) {
    try {
      const user = req.user as UserToken;
      if (user.level < 9) {
        throw new ErrorResponse(
          "You don't have permission to access this service",
          403,
          ["level"],
          "FORBIDDEN"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
