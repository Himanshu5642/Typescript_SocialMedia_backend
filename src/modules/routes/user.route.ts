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
    deleteAccount,
    searchUserHandler,
    followUnFollowUser,
    getFollowing,
    getFollowers
} from "../controller";

/*--------------------- Login ---------------------*/

UserRoute.post("/sendOtp", wrapAsync(otp_sender));
UserRoute.post("/verify", wrapAsync(verifyUserPhone));
UserRoute.post("/signUp", upload.fields([{ name: 'profile_pic', maxCount: 1 }]), wrapAsync(signUp));
UserRoute.post("/login", wrapAsync(login));
UserRoute.post("/logout", Authentication(User), wrapAsync(logOut));

/*--------------------- Profile ---------------------*/

UserRoute.get("/profile",Authentication(User), wrapAsync(viewProfile));
UserRoute.get("/userProfile",Authentication(User), wrapAsync(viewProfileById));
UserRoute.post("/user/search",Authentication(User), wrapAsync(searchUserHandler));
UserRoute.put("/profile/:id",Authentication(User), wrapAsync(updateAccount));
UserRoute.delete("/profile/:id",Authentication(User), wrapAsync(deleteAccount));

/*--------------------- Follower ---------------------*/

UserRoute.post("/follow", Authentication(User), wrapAsync(followUnFollowUser));
UserRoute.get("/following", Authentication(User), wrapAsync(getFollowing));
UserRoute.get("/followers", Authentication(User), wrapAsync(getFollowers));


export { UserRoute };
