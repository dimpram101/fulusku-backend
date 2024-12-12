import { Account } from "@prisma/client";
import prisma from "../../database";
import { ErrorResponse } from "../../models";
import { validate } from "./../../validations/Validation";
import { UpdateAccountRequest } from "./account-model";
import { AccountValidation } from "./account-validation";

export class AccountService {
  static async updateAccount(data: UpdateAccountRequest): Promise<void> {
    const validatedData: UpdateAccountRequest = await validate(
      AccountValidation.UPDATE_ACCOUNT,
      data
    );

    const isAccountExists = await prisma.account.findUnique({
      where: {
        id: validatedData.account_id
      }
    });

    if (!isAccountExists) {
      throw new ErrorResponse("Account not found", 404, ["account_id"]);
    }

    await prisma.account.update({
      where: {
        id: validatedData.account_id
      },
      data: {
        full_name: validatedData.full_name
      }
    });

    return;
  }

  static async checkAccount(phone_number: string): Promise<Account | null> {
    await validate(AccountValidation.CHECK_PHONE_NUMBER, { phone_number });

    const account = await prisma.account.findUnique({
      where: {
        phone_number
      }
    });

    return account;
  }
}
