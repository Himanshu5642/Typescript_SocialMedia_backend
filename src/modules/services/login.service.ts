import { msg } from "../config";
const CryptoJS = require("crypto-js");
import { SendOtp } from "../utils";
import { User } from "../models";
import { generateAuthToken } from "../utils";
import { sendSms } from "../utils";

export const otp_send = async (data: {country_code: number, phone: number}) => {
  let OTP = Math.floor(1000 + Math.random() * 999).toString();

  let user = await User.findOne({ phone: data.phone });
  // if (!user) throw msg.invalidPhone;
  if (user) {
    let abc = await SendOtp(user.country_code, data.phone, OTP);
    if (abc) {
      let otptxt = CryptoJS.AES.encrypt(OTP, process.env.secretKey).toString();
      console.log("otp", OTP);
      let newDate = new Date();
      let u = await User.findOneAndUpdate(
        { phone: data.phone },
        { $set: { otp: otptxt, otpDate: newDate } },
        { new: true }
      );
      if (!u) throw msg.NotExist;
      return {
        result: msg.success,
      };
    }
  }

  let updateUserdb;
  if (data.phone) {
    let abc = await SendOtp(data.country_code, data.phone, OTP);
    console.log("abc", abc);
    if (abc) {
      let ciphertext = CryptoJS.AES.encrypt(
        OTP,
        process.env.secretKey
      ).toString();
      console.log("otp", OTP);
      let newDate = new Date();
      let body = {
        country_code: data.country_code,
        phone: data.phone,
        otpDate: newDate,
        otp: ciphertext,
      };
      var u = new User(body);
      // console.log(u);

      updateUserdb = await u.save();
      if (updateUserdb) {
        return {
          result: msg.success,
        };
      }
    }
  }
};

export const global_login = async (body: {username: string, password: string, rememberMe: boolean}) => {
  let res = await User.findOne({ username: body.username, is_blocked: false, blockedByAdmin: false });
  if (!res) throw msg.userNotFound;
  let ciphertext = CryptoJS.AES.decrypt(
    res.password,
    process.env.secretKey
  ).toString(CryptoJS.enc.Utf8);
  console.log("password", ciphertext);

  if (ciphertext == body.password) {
    if (body.rememberMe === true) {
      let rememberData = await User.findOneAndUpdate(
        { username: body.username },
        { $set: { rememberMe: body.rememberMe } },
        { new: true }
      );
      console.log("rememberData", rememberData);
      // Set a long-lived cookie or store the user's ID in local storage for future logins
      // Example: Set a cookie with the user's ID
      // setCookie('rememberedUserID', res.id, { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
      return {
        res: rememberData,
        token: await generateAuthToken(res),
        message: msg.success,
      };
    } else {
      let rememberData = await User.findOneAndUpdate(
        { username: body.username },
        { $set: { rememberMe: body.rememberMe } },
        { new: true }
      );
      return {
        res: rememberData,
        token: await generateAuthToken(res),
        message: msg.success,
      };
    }
  }
  throw msg.incorrectPassword;
};

export const update_pass = async (data: {country_code: number, phone: number, newPassword: string}) => {
  let ciphertext = CryptoJS.AES.encrypt(
    data.newPassword,
    process.env.secretKey
  ).toString();
  await User.findOneAndUpdate(
    { phone: data.phone },
    { password: ciphertext },
    { new: true }
  );
  await sendSms(
    data.country_code.toString() + data.phone.toString(),
    "Your Password has been changed."
  );
  return {
    message: msg.password_updated,
  };
};