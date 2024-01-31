import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import "./modules/environment/environment.ts";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

const PORT = Number(process.env.port) || 3000;
const app = express();

import "./modules/db/mongoose";
import { router } from "./routes";
import { checkError } from "./modules/helpers";

app.use(mongoSanitize());
app.enable("trust proxy");
app.disable("x-powered-by");
app.use(cors({ origin: "http://localhost:3000", credentials:true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: any, res: any, next: any) => {
  return res.status(201).json("welcome to social media app - made by Himanshu");
});

// Error Handler
app.use(function (err: any, req: any, res: any, next: any) {
  if (err) {
    checkError(err, res);
  }
  next();
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
