import { NextFunction, Request, Response } from "express";
import { AccountService } from "./account-service";

export class AccountController {
  static async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { account_id, full_name } = req.body;
      await AccountService.updateAccount({ account_id, full_name });
      res.status(200).json({
        message: "Account updated"
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number } = req.query;
      const isAccountExist = await AccountService.checkAccount(phone_number as string);
      res.status(200).json({
        message: `Account ${isAccountExist ? "exists" : "does not exist"}`,
        payload: {
          exists: isAccountExist
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
