import { Request } from "express";
import { msg } from "../../config";
import { FavouritePost, Post } from "../../models";

const favOrUnfavPost = async (req: Request) => {
  const { post_id } = req.body;
  let post = await Post.findById(post_id);
  if (!post) throw "Post Does not exist";

  let postInFavourites = await FavouritePost.findOne({
    post_id: post_id,
    user_id: req.user._id,
  });
  if (postInFavourites) {
    await postInFavourites.deleteOne();
    return { msg: "Removed" };
  }

  await FavouritePost.create({
    user_id: req.user._id,
    post_id,
  });

  return { msg: "Added" };
};

const getAllPostInFavourite = async (req: Request) => {
    let getListOfFavourites = await FavouritePost.find({ user_id: req.user._id }).populate('post_id');
    if(getListOfFavourites.length == 0 ) return { msg: "No Post Added" };
    return getListOfFavourites;
}

export { 
    favOrUnfavPost,
    getAllPostInFavourite
};
