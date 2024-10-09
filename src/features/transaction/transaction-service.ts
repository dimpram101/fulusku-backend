import { MutationType } from "@prisma/client";
import prisma from "../../database";
import { ErrorResponse } from "../../models";
import { formatIDR } from "../../utils/currency";
import { validate } from "../../validations";
import { TransferRequest } from "./transaction-model";
import { TransactionValidation } from "./transaction-validation";

export class TransactionService {
  static async transfer(data: TransferRequest): Promise<void> {
    const validatedData: TransferRequest = await validate(
      TransactionValidation.TRANSFER,
      data
    );

    const isReceiverExists = await prisma.account.findUnique({
      where: {
        id: validatedData.to_account_id
      }
    });

    if (!isReceiverExists) {
      throw new ErrorResponse("Receiver account not found", 404, [
        "to_account_id"
      ]);
    }

    await prisma.$transaction(async prisma => {
      const sender = await prisma.account.findUnique({
        where: {
          id: validatedData.from_account_id
        }
      });

      if (!sender) {
        throw new ErrorResponse("Sender account not found", 404, [
          "from_account_id"
        ]);
      }

      if (sender.balance < validatedData.amount) {
        throw new ErrorResponse("Insufficient balance", 400, ["amount"]);
      }

      await prisma.account.update({
        where: {
          id: validatedData.from_account_id
        },
        data: {
          balance: {
            decrement: validatedData.amount
          }
        }
      });

      await prisma.account.update({
        where: {
          id: validatedData.to_account_id
        },
        data: {
          balance: {
            increment: validatedData.amount
          }
        }
      });

      await prisma.transaction.create({
        data: {
          from_account_id: validatedData.from_account_id,
          to_account_id: validatedData.to_account_id,
          amount: validatedData.amount
        }
      });

      await prisma.mutation.createMany({
        data: [
          {
            account_id: validatedData.from_account_id,
            type: MutationType.OUT,
            amount: validatedData.amount,
            description:
              "Transfer to " +
              validatedData.to_account_id +
              "with amount " +
              formatIDR(validatedData.amount)
          },
          {
            account_id: validatedData.to_account_id,
            type: MutationType.IN,
            amount: validatedData.amount,
            description:
              "Transfer from " +
              validatedData.from_account_id +
              "with amount " +
              formatIDR(validatedData.amount)
          }
        ]
      });

      return true;
    });
  }
}
