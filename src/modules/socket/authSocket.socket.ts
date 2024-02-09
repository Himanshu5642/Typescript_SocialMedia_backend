import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models";
// @ts-ignore
import { ExtendedError } from 'socket.io/dist/namespace';
import { JwtCustomPayload } from "../interfaces";
import { msg } from "../config";

export const AuthSocket = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  try {
    const token = socket.handshake.headers.token as string //|| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTlmYjRiZjMyYzBiMWFlMmU4ODcxNDciLCJpYXQiOjE3MDQ5NjUzMzJ9.ZN9H1SvNu0e9Xi2sWZ3hVvFNuyOFzo3-7UkiTJgnP64";
    if (!token) return next(new Error("Authentication Error"));

    const decoded_token = jwt.verify(
      token,
      process.env.secret_token as string
    ) as JwtCustomPayload;
    console.log("decoded token", decoded_token);

    let user = await User.findOne({
      _id: decoded_token,
      is_deleted: false,
    });
    if (!user) throw msg.UsernotExist;

    // @ts-ignore
    socket.user = user;
    // @ts-ignore
    socket.user.id = user._id.toString();
    
    next();
  } catch (error) {
    console.log(error);
    next(new Error("Authentication error"));
  }
};
