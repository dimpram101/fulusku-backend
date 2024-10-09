import { Router } from "express";
import { TransactionController } from "./transaction-controller";

const transactionRouter = Router();

transactionRouter.post("/transfer", TransactionController.transfer);

export default transactionRouter;