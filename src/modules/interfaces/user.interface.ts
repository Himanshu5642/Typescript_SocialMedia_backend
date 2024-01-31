import { Document, Types, ObjectId } from "mongoose";

export interface IUser extends Document {
    first_name: string,
    last_name: string,
    username: string,
    gender: string,
    password: string,
    rememberMe: boolean,
    phone: number,
    isPhoneVerified: boolean,
    otp: string,
    otpDate: Date,
    is_private: boolean,    
    is_activity_status: boolean,
    roleId: number,
    role: string,
    profile_pic: string,
    biography: string,
    codeValid: boolean,
    is_disabled: boolean,
    is_deleted: boolean,
    is_blocked: boolean,
    blockedByAdmin: boolean,
    followers_count: number,
    following_count: number,
    account_created: boolean,
    email: string,
    code: number,
    country_code: number,
    blocked_users: Array<Types.ObjectId>,
    refer_code: number,
    referral_code: number
}

export interface JwtCustomPayload {
    _id: string
}

export interface IUserFolder extends Document {
    user_id: ObjectId;
    name: string;
}

export interface IBlocked extends Document {
    block_by: Types.ObjectId;
    block_to: Types.ObjectId;
}
  
export interface IFollower extends Document {
    followed_by: ObjectId;
    followed_to: ObjectId;
    accepted: boolean;
}

export interface ICloseFriend extends Document {
    user_id: Types.ObjectId;
    friend: Types.ObjectId;
}