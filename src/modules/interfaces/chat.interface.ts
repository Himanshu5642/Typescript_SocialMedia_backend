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
  online: boolean;
}

export interface IMessage extends mongoose.Document {
  sender: Types.ObjectId;
  conversation: Types.ObjectId;
  text: string;
  isMedia: boolean;
  message: string;
  isSeen: boolean;
  seen_by: Types.ObjectId[];
}

// declare module 'socket.io' {
//   interface Socket {
//       user: string;
//   }
// }

