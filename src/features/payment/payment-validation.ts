import { PaymentMemberRole, PaymentStatus } from "@prisma/client";
import { ZodType, z } from "zod";

export class PaymentValidation {
  static readonly PAYMENT_SOLO: ZodType = z.object({
    payment_id: z.string(),
    account_id: z.string()
  });

  static readonly CREATE_DUMMY_PAYMENT: ZodType = z.object({
    account_number: z.string().nullable(),
    amount: z.number().nullable()
  });

  static readonly PAYMENT_WITH_MEMBER: ZodType = z.object({
    payment_id: z.string(),
    evenly: z.boolean().nullish(),
    members: z
      .array(
        z.object({
          account_id: z.string(),
          amount: z.number(),
          role: z.nativeEnum(PaymentMemberRole)
        })
      )
      .min(2, "At least 2 members are required")
  });

  static readonly UPDATE_MEMBER_STATUS: ZodType = z.object({
    account_id: z.string(),
    payment_id: z.string(),
    status: z.nativeEnum(PaymentStatus)
  });
}
