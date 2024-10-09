import { z, ZodType } from "zod";

export const CHECK_PIN: ZodType = z.object({
  account_id: z.string(),
  pin: z.string().length(6)
});
