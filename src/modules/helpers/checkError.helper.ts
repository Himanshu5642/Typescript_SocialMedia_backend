import mongoose from "mongoose";
import { Response } from "express";
import createError from "http-errors";
import { msg as message } from "../config";

export function checkError(err: any, res: Response) {
  let errorMsg, msg;
  console.log(err);
  if (err instanceof mongoose.Error) {
    return res.status(400).send({
      errorType: "Bad credentials",
      message: err.message,
    });
  }
  // MongoServerError
  if (err.name == "MongoServerError") {
    if (err.code == 11000) {
      const keyArr = Object.keys(err.keyPattern)[0].split(".");

      return res.status(400).send({
        errorType: "duplicate credientials",

        message: `${keyArr[keyArr.length - 1]} must be unique`,
      });
    }
    return res.status(400).send({
      errorType: "Duplicate credientials",
      message: err.message,
    });
  }
  if (err.isJoi) {
    return res.send(createError(422, { message: err.message }));
  }
  if (typeof err != "object") {
    msg = err;
  }
  errorMsg = {
    error: err || msg || message.serverError,
    body: msg || message.serverError,
  };
  return res.status(401).send(errorMsg);
}

export const errorHandler = (e: any, status = 400) => {
  let errorMsg, msg, err;
  // console.log(e);
  if (typeof e != "object") {
    msg = e;
  } else {
    err = e.message;
    if (err.includes("username_1 dup")) {
      msg = message.invalidUsername;
    } else if (err.includes("account_no_1 dup")) {
      msg = message.invalidAccountNo;
    } else if (err.includes("`password` is required")) {
      msg = message.passwordRequired
    } 
    // else if (err.includes("undefined") || err.includes("null")) {
    //   msg = message.serverError
    // } 
    else if (e.code == 11000) {
      msg = e.message;
    }
  }

  errorMsg = {
    error: err || msg || message.serverError,
    body: msg || message.serverError,
    status: status
  };
  return errorMsg;
};
