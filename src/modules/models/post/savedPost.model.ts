import mongoose, { Schema } from "mongoose";
import { ISavedPost } from "../../interfaces";

const SavedPostSchema = new Schema<ISavedPost>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    folder: { type: Schema.Types.ObjectId, ref: "userfolder" },
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  {
    timestamps: true,
  }
);

export const SavedPost = mongoose.model<ISavedPost>(
  "savedpost",
  SavedPostSchema
);
