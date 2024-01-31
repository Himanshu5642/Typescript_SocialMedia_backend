import mongoose, { Schema } from "mongoose";
import { LikeContentType } from "../../enums";
import { convertEnumToArray } from "../../helpers";
import { ILike } from "../../interfaces";

const LikeSchema = new Schema<ILike>(
  {
    // conetnt id type
    content_type: {
      type: String,
      enum: convertEnumToArray(LikeContentType),
    },
    content_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: function () {
        // @ts-ignore
        return this.content_type === "post" || this.content_type === "short";
      },
    },
    comment_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: function () {
        // @ts-ignore
        return this.content_type === "comment";
      },
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model("Like", LikeSchema);
