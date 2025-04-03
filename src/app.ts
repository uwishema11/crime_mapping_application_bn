import express from "express";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

app.use(errors());

export default app;
