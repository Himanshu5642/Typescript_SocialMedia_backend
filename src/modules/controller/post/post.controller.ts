import { Request } from "express";
import { HidePost, Post } from "../../models";
// import { ThumbnailGenerator } from "../../helpers";
import { msg } from "../../config";
import { Types } from "mongoose";

const newPostCreate = async (req: Request) => {
  // if user tried to mention himself remove the user id
  // req.body.mentions = req.body?.mentions?.filter((m: String) => m !== req.user._id) || [];

  // var thumbnail: any = '';
  // if(req.body.media_type == 'video'){
  //     const trimmedString = req.body.images[0].split('.com/')[1];
  //     thumbnail = await ThumbnailGenerator(trimmedString, res)
  //     console.log('thumbnail', thumbnail)
  // }

  let requestFiles = req.files as { [images: string]: Express.Multer.File[] };
  let imageFileName;
  if(requestFiles?.images) imageFileName = requestFiles?.images[0]?.filename;

  const newPost = await Post.create({
    ...req.body,
    images: imageFileName ? [imageFileName] : [],
    // thumbnail,
    user_id: req.user._id.toString(),
  });
  if (!newPost) throw msg.ErrorOccurredWhilePosting;
  return newPost;
};

const getAllPosts = async (req: Request) => {
  let hiddenPosts = await HidePost.find({ hide_by: req.user._id });
  let hiddenPostIdArr = hiddenPosts.map(post => post.post_id);

  const posts = await Post.aggregate([
    {
      $match: {
        _id: { $nin: hiddenPostIdArr }
      }
    },
    {
      $lookup: {
        from: "users",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$user_id", "$_id"],
              },
            },
          },
          { $project: { username: 1, profile_pic: 1 } },
        ],
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "categories",
        let: { category_id: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$category_id", "$_id"],
              },
            },
          },
          { $project: { name: 1 } },
        ],
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $sort: { createdAt: -1 }}
  ]);
  return posts;
};

const getMyPosts = async (req: Request) => {
  if(!req.query?.type) throw "type is required";
  const myPosts = await Post.aggregate([
    {
      $match: {
        user_id: req.user._id,
        content_type: req.query.type as string
      },
    },
    {
      $lookup: {
        from: "users",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$user_id", "$_id"],
              },
            },
          },
          { $project: { username: 1, profile_pic: 1 } },
        ],
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "categories",
        let: { category_id: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$category_id", "$_id"],
              },
            },
          },
          { $project: { name: 1 } },
        ],
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $sort: { createdAt: -1 }}
  ]);
  return myPosts;
};

const getPostById = async (req: Request) => {
  if(!req.query?.type) throw "type is required";
  const post = await Post.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.query.id as string),
        content_type: req.query.type as string
      },
    },
    {
      $lookup: {
        from: "users",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$user_id", "$_id"],
              },
            },
          },
          { $project: { username: 1, profile_pic: 1 } },
        ],
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "categories",
        let: { category_id: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$category_id", "$_id"],
              },
            },
          },
          { $project: { name: 1 } },
        ],
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $sort: { createdAt: -1 }}
  ]);
  return post;
};

const distinguishedCategoriesPost = async (req: Request) => {
  if(!req.query?.categoryId) throw "categoryId is required";

  let hiddenPosts = await HidePost.find({ hide_by: req.user._id });
  let hiddenPostIdArr = hiddenPosts.map(post => post.post_id);

  const posts = await Post.aggregate([
    {
      $match: {
        _id: { $nin: hiddenPostIdArr },
        category: new Types.ObjectId(req.query.categoryId as string)
      },
    },
    {
      $lookup: {
        from: "users",
        let: { user_id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$user_id", "$_id"],
              },
            },
          },
          { $project: { username: 1, profile_pic: 1 } },
        ],
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "categories",
        let: { category_id: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$category_id", "$_id"],
              },
            },
          },
          { $project: { name: 1 } },
        ],
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $sort: { createdAt: -1 }}
  ]);
  return posts;
};

const updatePost = async (req: Request) => {
  const postId = new Types.ObjectId(req.params.id as string);
  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId, user_id: req.user._id },
    { $set: req.body },
    { new: true }
  );
  if (!updatedPost) throw msg.ErrorUpdatingPost;
  return updatedPost;
};

const deletePost = async (req: Request) => {
  const postId = new Types.ObjectId(req.params.id as string);
  const deletedPost = await Post.findOneAndDelete({
    _id: postId,
    user_id: req.user._id,
  });
  return deletedPost;
};

export {
  newPostCreate,
  getAllPosts,
  getMyPosts,
  getPostById,
  distinguishedCategoriesPost,
  updatePost,
  deletePost,
};
