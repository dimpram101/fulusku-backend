import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment-service";

export class PaymentController {
  static async createDummyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payment = await PaymentService.createDummyPayment(req.body);
      return res.status(201).json({
        success: true,
        message: "Payment created",
        payload: {
          payment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await PaymentService.getUserPayments(req.user!.id);
      
      return res.status(200).json({
        success: true,
        message: "Payments found",
        payload: {
          ...payments
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.getPaymentById(req.params.paymentId);
      return res.status(200).json({
        success: true,
        message: "Payment found",
        payload: {
          ...payment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async paymentSolo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      await PaymentService.paymentSolo({
        account_id: id,
        ...req.body
      });
      return res.status(200).json({
        success: true,
        message: "Payment success"
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPaymentWithMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const members = await PaymentService.createPaymentWithMember(req.body);
      return res.status(201).json({
        success: true,
        message: "Payment created",
        payload: {
          members
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMemberStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;
      const { paymentId } = req.params;
      await PaymentService.updateMemberStatus({
        ...req.body,
        payment_id: paymentId,
        account_id: id
      });
      return res.status(200).json({
        success: true,
        message: "Member status updated"
      });
    } catch (error) {
      next(error);
    }
  }

  static async payWithMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { payment_id } = req.body;
      await PaymentService.payWithMembers(payment_id);
      return res.status(200).json({
        success: true,
        message: "Payment success"
      });
    } catch (error) {
      next(error);
    }
  }
}
