const jwt = require("jsonwebtoken");
import { IUser } from "../interfaces";

// For generating jwt auth token
export const generateAuthToken = (user: IUser) => {
  return new Promise((resolve, reject) => {
    let token = jwt.sign(
      { _id: user._id.toString() },
      process.env.secret_token
    );
    resolve(token);
  });
};
