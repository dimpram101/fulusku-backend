import { Router } from "express";
import { AuthMiddleware, JWTMiddleware } from "../../middlewares";
import { AuthController } from "./auth-controller";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.send("Hello from auth route");
});
authRouter.post("/register", AuthMiddleware.checkAccountForRegister, AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/insert-pin", AuthController.insertPin);
authRouter.get("/me", JWTMiddleware.verifyToken, AuthController.getMe);
// authRouter.post("/login", AuthController.login);

export default authRouter;
