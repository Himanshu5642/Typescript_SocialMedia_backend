import { Request, Response } from "express";
import { User } from "../../models";
import { showUserProfileService } from "../../services";
import { msg } from "../../config";
import { Types } from "mongoose";
import { Socket } from "socket.io";
import { IUser } from "../../interfaces";

const viewProfile = async (req: Request, res: Response) => {
  let findUser = await showUserProfileService(req.user._id.toString());
  if (!findUser) throw msg.userNotFound;
  return findUser;
};

const viewProfileById = async (req: Request, res: Response) => {
  let findUser = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.query.id as string),
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { userId: req.user._id, userSearchingId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followed_to", "$$userSearchingId"] },
                  { $eq: ["$followed_by", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "followings",
      },
    },
    {
      $addFields: {
        // following the user - true or false
        is_following: {
          $cond: [{ $gt: [{ $size: "$followings" }, 0] }, true, false],
        },
      },
    },
    {
      $project: {
        username: 1,
        profile_pic: 1,
        is_activity_status: 1,
        followers_count: 1,
        following_count: 1,
        is_following: 1,
      },
    },
  ]);
  if (!findUser) throw msg.userNotFound;
  return findUser;
};

const updateAccount = async (req: Request) => {
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

const deleteAccount = async (req: Request) => {
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

const searchUserHandler = async (req: Request) => {
  const { keyword } = req.body;
  let find_user = await User.find(
    { username: { $regex: keyword, $options: "i" }, is_deleted: false },
    "username profile_pic"
  ).lean();

  if (!find_user) throw msg.userNotFound;
  return find_user;
};

export {
  viewProfile,
  viewProfileById,
  updateAccount,
  deleteAccount,
  searchUserHandler,
};
