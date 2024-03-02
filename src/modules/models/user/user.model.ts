import mongoose, { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { msg } from "../../config";
import { IUser, JwtCustomPayload } from "../../interfaces";

const secretKey: string | undefined = process.env.secret_token;

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, trim: true, lowercase: true },
    last_name: { type: String, trim: true, lowercase: true },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
      // required: true,
    },
    password: String,
    rememberMe: {
      type: Boolean,
      default: false,
    },
    country_code: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      // trim: true,
      required: true,
      unique: true,
      index: true,
    },
    otp: String,
    otpDate: Date,
    isPhoneVerified: Boolean,
    is_private: { type: Boolean, default: false },
    is_activity_status: { type: Boolean, default: false },
    profile_pic: {
      type: String,
      default: "",
    },
    roleId: {
      type: Number,
      default: 0, //1 for SuperAdmin, 2 for Admin, 0 for user,
      enum: [0, 1, 2],
    },
    role: {
      type: String,
      default: "user",
      enum: ["SuperAdmin", "Admin", "user"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    biography: String,
    codeValid: { type: Boolean, default: true },
    is_disabled: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    followers_count: {
      type: Number,
      default: 0,
    },
    following_count: {
      type: Number,
      default: 0,
    },
    account_created: { type: Boolean, default: false },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    blockedByAdmin: {
      type: Boolean,
      default: false,
    },
    blocked_users: [{ type: Types.ObjectId, ref: "User" }],
    refer_code: Number,
    referral_code: Number,
    online: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.virtual("fullName").get(function (this: IUser) {
  return this.first_name + " " + this.last_name;
});

// Find User By Token
UserSchema.statics.findByToken = async function (token: string) {
  // var user = this;
  var decoded;
  try {
    decoded = jwt.verify(token, secretKey as string) as JwtCustomPayload;
    // console.log('decoded', decoded);
  } catch (e: any) {
    throw e.message || "Unauthorised request";
  }
  return User.findOne({
    _id: decoded._id,
    is_deleted: false,
  })
    .then((user: IUser | null) => {
      // console.log("userFindByToken", user);
      if (!user) {
        return Promise.reject({ message: msg.unauthorisedRequest });
      } else {
        return Promise.resolve(user);
      }
    })
    .catch((e: any) => {
      throw msg.unauthorisedRequest;
    });
};

const User = mongoose.model("User", UserSchema);
User.syncIndexes();
export { User };
