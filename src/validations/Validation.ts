import { ZodType } from "zod";

export const validate = async <T>(schema: ZodType<T>, data: T): Promise<T> => {
  return await schema.parseAsync(data);
};
