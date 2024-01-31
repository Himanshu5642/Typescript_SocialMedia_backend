import mongoose, { Document, Schema, Types } from "mongoose";
import { ICloseFriend } from "../../interfaces";

const CloseFriendSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    friend: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

CloseFriendSchema.index({ friend: 1, user_id: 1 }, { unique: true });

export const CloseFriend = mongoose.model<ICloseFriend>(
  "closefriend",
  CloseFriendSchema
);
