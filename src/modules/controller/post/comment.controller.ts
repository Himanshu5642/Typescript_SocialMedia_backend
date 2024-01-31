import { Request } from "express";
import { msg } from "../../config";
import { Comment, Post } from "../../models";
import { Types } from "mongoose";

const addComment = async (req: Request) => {
    const { content_id } = req.body;
    let post = await Post.findById(content_id);
    if(!post) throw "Post does not Exist";

    const newComment = await Comment.create({
        ...req.body,
        user_id: req.user._id
    });
    if(newComment) await Post.findOneAndUpdate({_id: content_id}, {$inc: { comments_count: 1}}, {new:true});
    return newComment;
}

const getAllComments = async (req:Request) => {
    const { postId } = req.query;
    let comments = await Comment.find({ content_id: postId, is_parent: true })
    .populate("content_id")
    .populate('user_id', 'username profile_pic')
    .sort({ createdAt: -1 })
    return comments;
}

const updateComment = async (req: Request) => {
    const { commentId } = req.query;
    await Comment.findOneAndUpdate({ _id: commentId, user_id: req.user._id}, { $set: { content: req.body.newComment }}, {new: true});
    return { msg: "done"};
}

const deleteComment = async (req: Request) => {
    await Comment.findOneAndDelete({ _id: req.params.id, user_id: req.user._id});
    await Post.findOneAndUpdate({_id: req.query.postId}, { $inc: { comments_count: -1 }}, {new:true});
    return { msg: "done"};
}


export {
    addComment,
    getAllComments,
    updateComment,
    deleteComment
}