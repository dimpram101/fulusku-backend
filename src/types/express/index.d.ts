import "express-serve-static-core";
import { UserToken } from "../../models";

declare global {
  namespace Express {
    interface Request {
      user: UserToken | undefined;
    }
  }
}

export { };

