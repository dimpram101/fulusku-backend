import prisma from "../../database";
import { ErrorResponse } from "../../models";
import { validate } from "../../validations";
import { TransferRequest } from "./transaction-model";
import { TransactionValidation } from "./transaction-validation";

export class TransactionService {
  static async transfer(data: TransferRequest): Promise<void> {
    const validatedData: TransferRequest = await validate(TransactionValidation.TRANSFER, data);

    const isReceiverExists = await prisma.account.findUnique({
      where: {
        id: validatedData.to_account_id
      }
    });

    if (!isReceiverExists) {
      throw new ErrorResponse("Receiver account not found", 404, ["to_account_id"]);
    }
  }
}