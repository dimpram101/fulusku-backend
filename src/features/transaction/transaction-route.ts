import { Router } from "express";
import { AuthMiddleware, JWTMiddleware } from "../../middlewares";
import { TransactionController } from "./transaction-controller";

const transactionRouter = Router();

transactionRouter.use(JWTMiddleware.verifyToken);
transactionRouter.post("/transfer", AuthMiddleware.checkPIN, TransactionController.transfer);

export default transactionRouter;
