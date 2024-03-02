import { IConversation } from "../../interfaces";
import mongoose, { Schema, Types } from "mongoose";

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    chat_type: {
      type: String,
      enums: ["single", "group"],
      default: "single",
    },
    groupAdmin: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupName: String,
    groupImage: {
      type: String,
      default: "", //noImageUrl
    },
    description: String,
    online: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

ConversationSchema.pre("save", function (next) {
  if (this.chat_type === "single") {
    this.groupAdmin = undefined;
    this.groupName = undefined;
    this.groupImage = undefined;
    this.description = undefined;
  }
  next();
});

export const Conversation = mongoose.model("Conversation", ConversationSchema);
