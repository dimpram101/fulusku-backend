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
        message: "Payment created",
        payload: {
          payment
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
      await PaymentService.paymentSolo(req.body);
      return res.status(200).json({
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
      const { paymentId } = req.params;
      await PaymentService.updateMemberStatus({
        payment_id: paymentId,
        ...req.body
      });
      return res.status(200).json({
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
        message: "Payment success"
      });
    } catch (error) {
      next(error);
    }
  }
}
