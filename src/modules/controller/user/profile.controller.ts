import { Request, Response } from "express";
import { User } from "../../models";
import { showUserProfileService } from "../../services";
import { msg } from "../../config";

const viewProfile = async (req: Request, res: Response) => {
  let findUser = await showUserProfileService(req.user._id.toString());
  if (!findUser) throw msg.userNotFound;
  return findUser;
};

const viewProfileById = async (req: Request, res: Response) => {
  let findUser = await showUserProfileService(req.query.id as string);
  if (!findUser) throw msg.userNotFound;
  return findUser;
};

const updateAccount = async (
  req: Request
) => {
  let userBody = {
    first_name: req.body?.first_name,
    last_name: req.body?.last_name,
    username: req.body?.username,
    gender: req.body?.gender,
    password: req.body?.password,
    rememberMe: req.body?.rememberMe,
    phone: req.body?.phone,
    profile_pic: req.body?.profile_pic,
    biography: req.body?.biography,
    // email: req.body.email,
  };
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id, is_deleted: false },
    { $set: userBody },
    { new: true }
  );
  return updatedUser;
};

const deleteAccount = async (
  req: Request
) => {
  const deletedUser = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      is_deleted: false,
    },
    { $set: { is_deleted: true } },
    { new: true }
  );
  return deletedUser;
};

// const updateProfile = async (req: Request) => {

// }

export { viewProfile, viewProfileById, updateAccount, deleteAccount };
