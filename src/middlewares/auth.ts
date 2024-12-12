import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import prisma from "../database";
import { ErrorResponse, UserToken } from "../models";
import { validate } from "../validations";
import { CHECK_PIN } from "../validations/auth";

export class AuthMiddleware {
  static async checkPIN(req: Request, _res: Response, next: NextFunction) {
    try {
      const { id } = req.user as UserToken;
      const { pin } = req.body;

      const validatedData = await validate(CHECK_PIN, { account_id: id, pin });

      const account = await prisma.account.findUnique({
        where: {
          id
        }
      });

      if (!account) {
        throw new ErrorResponse("Account not found", 404, ["account_id"]);
      }

      const isPinMatch = await compare(validatedData.pin, account!.pin);

      if (!isPinMatch) {
        throw new ErrorResponse("PIN doesn't match", 400, ["pin"]);
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  static async checkAccountForRegister(req: Request, _: Response, next: NextFunction) {
    try {
      const { phone_number } = req.body;

      const phoneNumberAccount = await prisma.account.findUnique({
        where: {
          phone_number
        }
      });

      if (phoneNumberAccount) {
        throw new ErrorResponse("Phone number already registered", 400, [
          "phone_number"
        ]);
      }

      next();

    } catch (error) {
      next(error);
    }
  }
}
