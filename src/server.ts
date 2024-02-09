import express from "express";
import { createServer } from "http";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import clientIo from "socket.io-client";

dotenv.config();

const PORT = process.env.port || 3000;
const app = express();
const server = createServer(app);

import "./modules/db/mongoose";
import { router } from "./routes";
import { checkError } from "./modules/helpers";
import { serverSocketConnection } from "./modules/socket";

app.use(mongoSanitize());
app.enable("trust proxy");
app.disable("x-powered-by");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://main--socialmedia34.netlify.app",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// server socket
serverSocketConnection(server);

// client socket
const clientSocket = clientIo("http://localhost:4430");
clientSocket.on("connect", () => {
  console.log("client socket connected");
});

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

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
