import { Request } from "express";
import { Post, HidePost } from "../../models";
import { msg } from "../../config";
import { Types } from "mongoose";

const hideUnhidePost = async (req: Request) => {
    const postId = req.body.post_id as string;
    const post = await Post.findById(postId);
    if(!post) throw "Post Does not exist";

    const hiddenPost = await HidePost.findOne({post_id: new Types.ObjectId(postId), hide_by: req.user._id});
    if(hiddenPost) {
        await hiddenPost.deleteOne();
        return { msg: "Unhidden" };
    } else {
        let hidePost = new HidePost({
            post_id: postId,
            hide_by: req.user._id
        });
        await hidePost.save();
        return { msg: "Hidden" }
    }
}

const allHiddenPosts = async (req: Request) => {
    const hiddenPosts = await HidePost.find({ hide_by: req.user._id }).populate("post_id") ;
    return hiddenPosts;
}


export {
    hideUnhidePost,
    allHiddenPosts
}