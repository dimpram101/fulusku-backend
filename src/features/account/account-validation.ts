import { z, ZodType } from "zod";

export class AccountValidation {
  static readonly UPDATE_ACCOUNT: ZodType = z.object({
    account_id: z.string(),
    full_name: z.string()
  });

  static readonly CHECK_PHONE_NUMBER: ZodType = z.object({
    phone_number: z.string()
  });
}
