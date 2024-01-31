import mongoose, { Document, Schema, ObjectId } from "mongoose";
import {IFavouritePost} from "../../interfaces"

const FavouritePostSchema = new Schema<IFavouritePost>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },

    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  {
    timestamps: true,
  }
);

export const FavouritePost = mongoose.model<IFavouritePost>(
  "favpost",
  FavouritePostSchema
);
