import { Router } from "express";
import { AccountController } from "./account-controller";

const accountRouter = Router();

accountRouter.put("/update", AccountController.updateAccount);
accountRouter.get("/check", AccountController.checkAccount);

export default accountRouter;