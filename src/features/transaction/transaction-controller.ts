import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction-service";

export class TransactionController {
  static async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      const { transaction, mutation } = await TransactionService.transfer({
        from_account_id: id,
        to_account_id: req.body.to_account_id,
        amount: Number(req.body.amount),
        pin: req.body.pin
      });
      return res.status(200).json({
        success: true,
        message: "Transfer successful",
        payload: {
          transaction,
          mutation
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async topUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      const { mutation } = await TransactionService.topUp(
        id,
        Number(req.body.amount)
      );
      return res.status(200).json({
        success: true,
        message: "Top-up successful",
        payload: {
          mutation
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMutations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      const { limit } = req.query;
      const mutations = await TransactionService.getMutations(
        id,
        limit ? Number(limit) : undefined
      );
      return res.status(200).json({
        success: true,
        message: "Mutations found",
        payload: {
          mutations
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
