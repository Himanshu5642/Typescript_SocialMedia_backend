import { IMessage } from "../../interfaces";
import mongoose, { Schema, Types } from "mongoose";

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
    text: String,
    isMedia: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    seen_by: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Message = mongoose.model("message", MessageSchema);
