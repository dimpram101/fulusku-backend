import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction-service";

export class TransactionController {
  static async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      await TransactionService.transfer({ from_account_id: id, ...req.body });
      return res.status(200).json({
        message: "Transfer successful"
      });
    } catch (error) {
      next(error);
    }
  }
}
