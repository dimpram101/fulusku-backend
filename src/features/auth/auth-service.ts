import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../database";
import { ErrorResponse } from "../../models";
import { validate } from "../../validations";
import { InsertPinRequest, LoginRequest, RegisterRequest } from "./auth-model";
import { AuthValidation } from "./auth-validation";

const GEN_SALT = 10;

export class AuthService {
  static async register(data: RegisterRequest) {
    const validatedData: RegisterRequest = await validate(
      AuthValidation.REGISTER,
      data
    );

    const phoneNumberAccount = await prisma.account.findUnique({
      where: {
        phone_number: validatedData.phone_number
      }
    });

    if (phoneNumberAccount) {
      throw new ErrorResponse("Phone number already registered", 400, [
        "phone_number"
      ]);
    }

    const trimmedPin = validatedData.pin.trim();
    validatedData.pin = await hash(trimmedPin, GEN_SALT);

    const account = await prisma.$transaction(async prisma => {
      const account = await prisma.account.create({
        data: {
          id: validatedData.phone_number,
          full_name: validatedData.full_name,
          phone_number: validatedData.phone_number,
          pin: validatedData.pin
        }
      });

      await prisma.notification.create({
        data: {
          title: "Welcome",
          message: "Welcome to our app!",
          send_all: false,
          receivers: {
            create: {
              account_id: account.id
            }
          }
        }
      });

      return account;
    });

    const token = jwt.sign(
      {
        id: account.id
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );

    return { token, account };
  }

  static async checkLogin(data: LoginRequest) {
    const validatedData = await validate(AuthValidation.LOGIN, data);

    const account = await prisma.account.findUnique({
      where: {
        phone_number: validatedData.phone_number
      }
    });

    if (!account) {
      throw new ErrorResponse("Account not found", 404, ["phone_number"]);
    }

    return true;
  }

  static async insertPin(data: InsertPinRequest) {
    const validatedData = await validate(AuthValidation.INSERT_PIN, data);

    const account = await prisma.account.findUnique({
      where: {
        phone_number: validatedData.phone_number
      }
    });
    console.log(account);
    if (!account) {
      throw new ErrorResponse("Account not found", 404, ["phone_number"]);
    }

    const isPinMatch = await compare(validatedData.pin, account!.pin);

    if (!isPinMatch) {
      throw new ErrorResponse("PIN doesn't match", 400, ["pin"]);
    }

    const token = jwt.sign(
      {
        id: account!.id
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );

    return {
      token,
      account
    };
  }

  static async getMe(accountId: string) {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId
      }
    });

    const mutations = await prisma.mutation.findMany({
      where: {
        account_id: accountId
      }
    });
    
    return {
      account,
      mutations
    }
  }
}
