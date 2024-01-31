import mongoose, { Schema } from "mongoose";
import { CommentContentType } from "../../enums";
import { convertEnumToArray } from "../../helpers";
import { IComment } from "../../interfaces";

const CommentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_parent: {
      type: Boolean,
      default: true,
    },
    like_count: { type: Number, default: 0 },
    content: {
      type: String,
      required: true,
    },
    content_type: {
      type: String,
      enum: convertEnumToArray(CommentContentType),
      required: true,
    },
    content_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    reply: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
