import { Router } from "express";
import { JWTMiddleware } from "../../middlewares";
import { AccountController } from "./account-controller";

const accountRouter = Router();

accountRouter.use(JWTMiddleware.verifyToken);
accountRouter.put("/update", AccountController.updateAccount);
accountRouter.get("/check", AccountController.checkAccount);

export default accountRouter;
