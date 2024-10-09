import { Router } from "express";
import { AuthController } from "./auth-controller";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.send("Hello from auth route");
});
authRouter.post("/register", AuthController.register);
authRouter.post("/check", AuthController.checkAccount);
authRouter.post("/login", AuthController.login);
// authRouter.post("/login", AuthController.login);

export default authRouter;
