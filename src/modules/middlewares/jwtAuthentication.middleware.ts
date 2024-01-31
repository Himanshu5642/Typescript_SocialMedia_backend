import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces";
import {Model} from "mongoose";
import { User } from "../models";
import { checkError } from "../helpers";

// User Authentication By Token
const Authentication = (model: Model<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') as string;
        // console.log('token', token);
        // const decodedString = jwt.verify(token, process.env.secret_token);
        // console.log("decodedString", decodedString);
        const user: IUser = await User.findByToken(token);
        console.log("user", user._id);
        req.user = user;
        next();
    } catch (error) {
        checkError(error, res)
    }
}

export { Authentication };
