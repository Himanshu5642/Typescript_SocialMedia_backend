import { Router } from "express";
const UserRoute = Router();

import { User } from "../models";
import { Authentication, validate } from "../middlewares";
import { wrapAsync } from "../helpers";
import { upload } from "../middlewares";
import { 
    otp_sender,
    verifyUserPhone,
    signUp,
    login,
    logOut,
    viewProfile,
    viewProfileById,
    updateAccount,
    deleteAccount
} from "../controller";

/*--------------------- Login ---------------------*/

UserRoute.post("/sendOtp", wrapAsync(otp_sender));
UserRoute.post("/verify", wrapAsync(verifyUserPhone));
UserRoute.post("/signUp", upload.fields([{ name: 'profile_pic', maxCount: 1 }]), wrapAsync(signUp));
UserRoute.post("/login", wrapAsync(login));
UserRoute.post("/logout", wrapAsync(logOut));

/*--------------------- Profile ---------------------*/

UserRoute.get("/profile",Authentication(User), wrapAsync(viewProfile));
UserRoute.get("/userProfile",Authentication(User), wrapAsync(viewProfileById));
UserRoute.put("/profile/:id",Authentication(User), wrapAsync(updateAccount));
UserRoute.delete("/profile/:id",Authentication(User), wrapAsync(deleteAccount));


export { UserRoute };
