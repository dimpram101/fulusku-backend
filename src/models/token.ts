import { JwtPayload } from "jsonwebtoken";

export interface UserToken extends JwtPayload {
  id: string
}

