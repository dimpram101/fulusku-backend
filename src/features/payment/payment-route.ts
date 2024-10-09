import { Router } from "express";
import { AuthMiddleware, JWTMiddleware } from "../../middlewares";
import { PaymentController } from "./payment-controller";

const paymentRouter = Router();

paymentRouter.post("/create/dummy", PaymentController.createDummyPayment);
paymentRouter.use(JWTMiddleware.verifyToken);
paymentRouter.post(
  "/create/member",
  PaymentController.createPaymentWithMembers
);
paymentRouter.post(
  "/solo",
  AuthMiddleware.checkPIN,
  PaymentController.paymentSolo
);
paymentRouter.get("/:paymentId", PaymentController.getPaymentById);
paymentRouter.post(
  "/member",
  AuthMiddleware.checkPIN,
  PaymentController.payWithMembers
);
paymentRouter.put(
  "/:paymentId/member",
  AuthMiddleware.checkPIN,
  PaymentController.updateMemberStatus
);

export default paymentRouter;
