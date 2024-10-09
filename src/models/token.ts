import { JwtPayload } from "jsonwebtoken";

export interface UserToken extends JwtPayload {
  employee_id: number,
  level: number,
}

