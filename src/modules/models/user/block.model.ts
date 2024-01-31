import mongoose, { Schema } from "mongoose";
import { IBlocked } from "../../interfaces";

const BlockSchema = new Schema(
  {
    block_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    block_to: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Blocked = mongoose.model<IBlocked>("blockeduser", BlockSchema);
