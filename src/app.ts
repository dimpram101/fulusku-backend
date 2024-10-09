import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";
// import {
//   attendanceRouter,
//   authRouter,
//   employeeRouter,
//   employmentStatusRouter,
//   jobPositionRouter,
//   shiftRouter
// } from "./features";
import { authRouter } from "./features";
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

app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.returnError);

export default app;
