import { PostContentType, PostVisibility } from "../enums";
import {Types, Document, ObjectId} from "mongoose";
import { IUser } from './user.interface';

export interface IPost extends Document{
    content_type: PostContentType;
    comments_count: number;
    like_count: number;
    visibility: PostVisibility;
    caption: string;
    user_id: Types.ObjectId;
    hash_tags: [String];
    mentions: [String];
    thumbnail: String;
    images: [String];
    category: String;
    location: String;
    media_type: String;
    message: String;
    only_close_friends: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILike extends Document {
    content_type:String;
    content_id?: Types.ObjectId;
    comment_id?: Types.ObjectId;
    user_id: Types.ObjectId;
}

export interface IFavouritePost extends Document {
    user_id: ObjectId;
    post_id: ObjectId;
}

export interface ISavedPost extends Document {
    user_id: ObjectId;
    folder: ObjectId;
    post_id: ObjectId;
}

export interface IComment extends Document {
    user_id: IUser;
    content: String;
    post_id: ObjectId;
    comment_id?: ObjectId;
    reply: any[];
}
