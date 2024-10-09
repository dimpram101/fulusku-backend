import { z, ZodType } from "zod";

export class TransactionValidation {
  static readonly TRANSFER: ZodType = z.object({
    from_account_id: z.string(),
    to_account_id: z.string(),
    amount: z.number().positive(),
    from_pin: z.string().length(6)
  });
}
