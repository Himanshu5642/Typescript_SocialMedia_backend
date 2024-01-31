import { Request } from "express";
import { Comment, Like, Post } from "../../models";
import { msg } from "../../config";
import { Types } from "mongoose";

const likePost = async (req: Request) => {
    const post = await Post.findById(req.body.content_id);
    if(!post) throw msg.PostNotExist;

    const unlikePost = await Like.findOneAndDelete({ content_id: req.body.content_id, user_id: req.user._id });
    if(unlikePost) {
        await Post.findOneAndUpdate(
            { _id: req.body.content_id },
            { $inc : { like_count: -1 }},
            { new: true }
        );
        return { msg: "unliked" };
    }

    const likePost = new Like({
        ...req.body,
        user_id: req.user._id.toString()
    });
    await likePost.save();
    if(!likePost) throw "post not availaible";
    
    await Post.findOneAndUpdate(
        { _id: req.body.content_id },
        { $inc : { like_count: 1 }},
        { new: true }
    );
    return { msg: "liked" }
}

const likeComment = async (req: Request) => {
    console.log("comment_id", req.body.comment_id, typeof req.body.comment_id);
    const comment = await Comment.findById(req.body.comment_id);
    if(!comment) throw "Comment does not Exist";

    const unlikeComment = await Like.findOneAndDelete({ comment_id: req.body.comment_id, user_id: req.user._id });
    if(unlikeComment) {
        await Comment.findOneAndUpdate(
            { _id: req.body.comment_id },
            { $inc : { like_count: -1 }},
            { new: true }
        );
        return { msg: "unliked" };
    }

    const likeComment = new Like({
        ...req.body,
        user_id: req.user._id.toString()
    });
    await likeComment.save();
    if(!likeComment) throw "post not availaible";
    
    await Comment.findOneAndUpdate(
        { _id: req.body.comment_id },
        { $inc : { like_count: 1 }},
        { new: true }
    );
    return { msg: "liked" }    
}

const getLikes = async (req: Request) => {
    if(!req.query.contentId && !req.query.commentId) throw msg.idrequired;
    const likes = await Like.aggregate([
        {
            $match: {
                $or: [
                    { content_id: new Types.ObjectId(req.query.contentId as string)},
                    { comment_id: new Types.ObjectId(req.query.commentId as string)}
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                let: { userId: "$user_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$userId", "$_id"]
                            }
                        }
                    },
                    { $project: { username: 1, profile_pic: 1 }}
                ],
                as: "user"
            }
        },
        { $unwind: "$user"},
        { $project: { user_id: 0,  }}
    ]);
    if(!likes) throw "No Likes Yet";
    return likes;
}


export {
    likePost,
    likeComment,
    getLikes
}