import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    full_name: z.string(),
    phone_number: z.string(),
    pin: z.string().min(6, " Pin must be at least 6 characters")
  });
  
  static readonly LOGIN: ZodType = z.object({
    phone_number: z.string(),
  });

  static readonly INSERT_PIN: ZodType = z.object({
    phone_number: z.string(),
    pin: z.string().min(6, "Pin must be at least 6 characters")
  });
}
