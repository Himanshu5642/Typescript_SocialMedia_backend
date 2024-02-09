import mongoose, { Schema, Types } from "mongoose";

export interface IConversation extends mongoose.Document {
  _id: string;
  participants: Types.ObjectId[];
  createdBy: Types.ObjectId;
  chat_type: string;
  groupAdmin: Types.ObjectId[] | undefined;
  groupName: string | undefined;
  groupImage: String | undefined;
  description: String | undefined;
}

export interface IMessage extends mongoose.Document {
  sender: Types.ObjectId;
  conversation: Types.ObjectId | string;
  text: string;
  isMedia: boolean;
  message: string;
  isSeen: boolean;
  seen_by: Types.ObjectId[];
  online: boolean;
}
