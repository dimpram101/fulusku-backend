import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";
import { accountRouter, authRouter, transactionRouter } from "./features";
import { ErrorMiddleware } from "./middlewares";

dotenv.config();

const app: Express = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);

app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.returnError);

export default app;
