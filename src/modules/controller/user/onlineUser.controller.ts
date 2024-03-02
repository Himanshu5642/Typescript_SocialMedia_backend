import { Request } from "express";
import { Socket } from "socket.io";
import { Follower, User } from "../../models";
import { Types } from "mongoose";

const onlineUser = async (socket: Socket) => {
  // @ts-ignore
  const userId = socket.user._id;
  // const findUser: IUser | null = await User.findById(userId);
  // if (!findUser) throw msg.userNotFound;

  // let isOnline = findUser?.online;
  // console.log("online", isOnline);
  await User.findByIdAndUpdate(
    userId,
    { $set: { online: true } },
    { new: true }
  );
  socket.broadcast.emit("getOnlineUsers");
};

const getOnlineUsers = async (req: Request) => {
  return await Follower.aggregate([
    {
      $match: {
        followed_by: req.user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followed_to",
        foreignField: "_id",
        as: "followedUsers",
      },
    },
    { $unwind: "$followedUsers" },
    { $replaceRoot: { newRoot: "$followedUsers" } },
    {
      $project: {
        username: 1,
        profile_pic: 1,
        online: 1,
      },
    },
  ]);
};

export { onlineUser, getOnlineUsers };
