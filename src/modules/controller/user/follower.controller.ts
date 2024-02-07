import { Request } from "express";
import { User, Follower } from "../../models";
import { msg } from "../../config";

const followUnFollowUser = async (req: Request) => {
  const { userId } = req.body;
  if (userId == req.user._id) throw "You can't follow yourself";

  const find_user = await User.findOne({ _id: userId, is_deleted: false });
  if (!find_user) throw msg.userNotFound;

  let alreadyFollowing = await Follower.findOne({
    followed_by: req.user._id,
    followed_to: userId,
  });

  if (alreadyFollowing) {
    await alreadyFollowing.deleteOne();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { following_count: -1 } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { followers_count: -1 } },
      { new: true }
    );
    return { msg: "unFollowed" };
  }

  await Follower.create({
    followed_by: req.user._id,
    followed_to: userId,
  });
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { following_count: 1 } },
    { new: true }
  );
  await User.findOneAndUpdate(
    { _id: userId },
    { $inc: { followers_count: 1 } },
    { new: true }
  );
  return { msg: "followed" };
};

const getFollowing = async (req: Request) => {
  const { userId } = req.query;
  let matchQuery = {};

  if (userId) matchQuery = { followed_to: userId };
  else matchQuery = { followed_to: req.user._id };

  const followings = Follower.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: "users",
        let: { followed_by: "$followed_by" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$followed_by", "$_id"],
              },
            },
          },
          {
            $project: { username: 1, profile_pic: 1 },
          },
        ],
        as: "followed_by",
      },
    },
    { $unwind: "$followed_by" },
    {
      $lookup: {
        from: "users",
        let: { followed_to: "$followed_to" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$followed_to", "$_id"],
              },
            },
          },
          {
            $project: { username: 1, profile_pic: 1 },
          },
        ],
        as: "followed_to",
      },
    },
    { $unwind: "$followed_to" },
  ]);

  return followings;
};

const getFollowers = async (req: Request) => {
  const { userId } = req.query;
  let matchQuery = {};

  if (userId) matchQuery = { followed_by: userId };
  else matchQuery = { followed_by: req.user._id };

  const followers = Follower.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: "users",
        let: { followed_by: "$followed_by" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$followed_by", "$_id"],
              },
            },
          },
          {
            $project: { username: 1, profile_pic: 1 },
          },
        ],
        as: "followed_by",
      },
    },
    { $unwind: "$followed_by" },
    {
      $lookup: {
        from: "users",
        let: { followed_to: "$followed_to" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$followed_to", "$_id"],
              },
            },
          },
          {
            $project: { username: 1, profile_pic: 1 },
          },
        ],
        as: "followed_to",
      },
    },
    { $unwind: "$followed_to" },
  ]);

  return followers;
};

export { followUnFollowUser, getFollowing, getFollowers };
