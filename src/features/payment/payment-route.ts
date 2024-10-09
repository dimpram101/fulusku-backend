import { Router } from "express";
import { PaymentController } from "./payment-controller";

const paymentRouter = Router();

paymentRouter.post("/create/dummy", PaymentController.createDummyPayment);
paymentRouter.post("/create/member", PaymentController.createPaymentWithMembers);
paymentRouter.post("/solo", PaymentController.paymentSolo);
paymentRouter.get("/:paymentId", PaymentController.getPaymentById);
paymentRouter.post("/member", PaymentController.payWithMembers);
paymentRouter.put("/:paymentId/member", PaymentController.updateMemberStatus);

export default paymentRouter;
