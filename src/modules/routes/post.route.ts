import { Router } from "express";
const PostRoute = Router();
import { User } from "../models";
import { Authentication, validate } from "../middlewares";
import { wrapAsync } from "../helpers";
import { upload } from "../middlewares";
import { 
    newPostCreate,
    getAllPosts,
    getMyPosts,
    getPostById,
    distinguishedCategoriesPost,
    updatePost,
    deletePost,
    likePost,
    likeComment,
    getLikes,
    hideUnhidePost,
    allHiddenPosts,
    addComment,
    getAllComments,
    updateComment,
    deleteComment,
    favOrUnfavPost,
    getAllPostInFavourite
} from "../controller";

/*--------------------- Post ---------------------*/

PostRoute.post("/createPost", Authentication(User), upload.fields([{name: 'images', maxCount: 5}]), wrapAsync(newPostCreate));
PostRoute.get("/allPosts", Authentication(User), wrapAsync(getAllPosts));
PostRoute.get("/MyPosts", Authentication(User), wrapAsync(getMyPosts));
PostRoute.get("/post", Authentication(User), wrapAsync(getPostById));
PostRoute.get("/post/categories", Authentication(User), wrapAsync(distinguishedCategoriesPost));
PostRoute.put("/post/:id", Authentication(User), wrapAsync(updatePost));
PostRoute.delete("/post/:id", Authentication(User), wrapAsync(deletePost));

/*--------------------- Like ---------------------*/

PostRoute.post("/post/like", Authentication(User), wrapAsync(likePost));
PostRoute.post("/comment/like", Authentication(User), wrapAsync(likeComment));
PostRoute.get("/likes", Authentication(User), wrapAsync(getLikes));

/*--------------------- HidePost ---------------------*/

PostRoute.post("/post/hideUnhide", Authentication(User), wrapAsync(hideUnhidePost));
PostRoute.get("/hiddenPosts", Authentication(User), wrapAsync(allHiddenPosts));

/*--------------------- Comment ---------------------*/

PostRoute.post("/post/comment", Authentication(User), wrapAsync(addComment));
PostRoute.get("/allComments", Authentication(User), wrapAsync(getAllComments));
PostRoute.put("/comment", Authentication(User), wrapAsync(updateComment));
PostRoute.delete("/comment/:id", Authentication(User), wrapAsync(deleteComment));

/*--------------------- Favourite ---------------------*/

PostRoute.post("/post/favourite", Authentication(User), wrapAsync(favOrUnfavPost));
PostRoute.get("/getListOfFavourites", Authentication(User), wrapAsync(getAllPostInFavourite));


export { PostRoute };