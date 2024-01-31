import { Request, Response } from "express";
const CryptoJS = require("crypto-js");
import { User } from "../../models";
import { global_login, otp_send } from "../../services";
import { msg } from "../../config";
import { generateAuthToken } from "../../utils";
import moment from "moment";

const otp_sender = (req: Request, res: Response) => {
  return otp_send(req.body);
};

const verifyUserPhone = async (req: Request, res: Response) => {
  if (!req.body.otp) throw msg.requiredOtp;
  if (!req.body.phone) throw msg.requiredPhone;
  let user = await User.findOne({ phone: req.body.phone });
  if (!user) throw msg.UsernotExist;
  let date1 = user.otpDate;
  let date1Time = date1.getTime();
  let date2 = new Date();
  let date2Time = date2.getTime();
  let minutes = (date2Time - date1Time) / (1000 * 60);
  if (minutes > 2) throw msg.expireOtp;

  let ciphertext = CryptoJS.AES.decrypt(
    user.otp,
    process.env.secretKey
  ).toString(CryptoJS.enc.Utf8);

  if (ciphertext == req.body.otp) {
    let res = await User.findByIdAndUpdate(user._id, {
      $set: { isPhoneVerified: true },
    });
    return {
      message: msg.success,
    };
  } else throw msg.incorrectOTP;
};

const signUp = async (req: Request, res: Response) => {
  let { username, password, cpassword, phone } = req.body;
  if (!username) throw msg.usernameRequired;
  if (!password) throw msg.passwordRequired;

  let find_user = await User.findOne({ username: username });
  if (find_user) throw msg.userExist;

  let find_phone = await User.findOne({
    username: undefined,
    phone: phone,
    isPhoneVerified: true,
  });
  if (!find_phone) throw msg.invalidPhone;

  if (password !== cpassword)
    throw "Please provide the same password in both password fields";

//   body.active = true;
//   body.roleId = 0;
//   body.role = "Player";
  delete req.body.cpassword;

  let ciphertext = CryptoJS.AES.encrypt(
    password,
    process.env.secretKey
  ).toString();
  req.body.password = ciphertext;

  let requestFiles = req.files as { [images: string]: Express.Multer.File[] };
  if(requestFiles?.profile_pic) req.body['profile_pic'] = requestFiles?.profile_pic[0].filename;
  const user = await User.findOneAndUpdate(
    { phone: phone },
    { $set: {...req.body} },
    { new: true }
  );
  if(!user) throw msg.serverError;
  let token = await generateAuthToken(user);
  // res.cookie("AccessToken", token, { maxAge: 86400, httpOnly: true });
  return { user, token, message: msg.success };
};

const login = async (req: Request, res: Response) => {
  console.log("body", req.body);
  if (!req.body.username) throw msg.invalidUsername;
  if (!req.body.password) throw msg.passwordRequired;

  let loggedInUser = await global_login(req.body);
  let present_date: Date = moment().add(10, 'd').toDate();
  // console.log(present_date)

  // res.cookie("AccessToken", loggedInUser.token, { expires: present_date, httpOnly: true });
  return loggedInUser;
};  

const logOut = async (req: Request, res: Response) => {
  res.clearCookie('AccessToken', {
    secure: true,
    sameSite: 'none'
  });
  return { msg: "logged out" };
}

export { otp_sender, verifyUserPhone, signUp, login, logOut };
