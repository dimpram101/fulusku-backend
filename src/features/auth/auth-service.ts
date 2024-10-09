import bcrypt from "bcrypt";
import prisma from "../../database";
import { ErrorResponse } from "../../models";
import { validate } from "../../validations";
import { RegisterRequest } from "./auth-model";
import { AuthValidation } from "./auth-validation";

const GEN_SALT = 10;

export class AuthService {
  static async register(data: RegisterRequest) {
    const validatedData: RegisterRequest = await validate(
      AuthValidation.REGISTER,
      data
    );

    const phoneNumberAcount = await prisma.account.findUnique({
      where: {
        phone_number: validatedData.phone_number
      }
    });

    if (phoneNumberAcount) {
      throw new ErrorResponse("Phone number already registered", 400, [
        "phone_number"
      ]);
    }

    let isAccountExists = true;
    let accountNumber = "";

    while (isAccountExists) {
      const randomAccountNumber = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();

      const account = await prisma.account.findUnique({
        where: {
          id: randomAccountNumber
        }
      });

      if (!account) {
        isAccountExists = false;
        accountNumber = randomAccountNumber;
      }
    }

    const hashedPin = await bcrypt.hash(validatedData.pin, GEN_SALT);
    validatedData.pin = hashedPin;

    return await prisma.$transaction(async prisma => {
      const account = await prisma.account.create({
        data: {
          id: accountNumber,
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
  }
}
