import { Socket } from "socket.io";
import { Conversation, Message } from "../../models";
import { IMessage } from "../../interfaces";
import { msg } from "../../config";
import { Request } from "express";
import { Types } from "mongoose";

const sendMessageController = async (data: IMessage, socket: Socket) => {
  // @ts-ignore
  const user = socket.user;
  console.log("sendingUser", user);
  const { conversation, text } = data;

  // find the conversation
  const existingConversation = await Conversation.findOne({
    _id: conversation,
    participants: { $in: [user._id] },
  });
  if (!existingConversation)
    return socket
      .to(conversation.toString())
      .emit("messageError", "You are not part of this conversation");

  // save message
  let newMessage = new Message({
    sender: user._id,
    conversation,
    text,
  });
  let res = await newMessage.save();
  if (!res)
    return socket
      .to(conversation.toString())
      .emit("messageError", "Error saving Message!");

  let sendingData = {
    res,
    senderInfo: {
      _id: user._id,
      username: user.username,
      profile_pic: user.profile_pic,
    },
  };

  // emit to the room
  socket.to(conversation.toString()).emit("messageReceiver", sendingData);
};

const getAllMessages = async (req: Request) => {
  const { conversationId } = req.query;
  if (!conversationId) throw msg.idrequired;

  const messages = await Message.aggregate([
    {
      $match: {
        conversation: new Types.ObjectId(conversationId as string),
      },
    },
    {
      $lookup: {
        from: "users",
        let: { sender: "$sender" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$sender", "$_id"],
              },
            },
          },
          {
            $project: {
              username: 1,
              profile_pic: 1,
            },
          },
        ],
        as: "sender",
      },
    },
    { $unwind: "$sender" },
  ]);
  return messages;
};

const updateMessage = async (req: Request) => {
  const { id } = req.params;
  const updatedMessage = await Message.findOneAndUpdate(
    { _id: id, sender: req.user._id },
    { $set: { text: req.body.text } },
    { $new: true }
  );
  if (!updatedMessage) throw "Message Not Found";
  return { msg: "Done" };
};

const deleteMessage = async (req: Request) => {
  const { id } = req.params;
  let message = await Message.findOneAndDelete({
    _id: id,
    sender: req.user._id,
  });
  if (!message) throw "Message not Found";
  return { msg: "Done" };
};

const deleteMultipleMessage = async (req: Request) => {
  const { messageIds } = req.body;
  let message = await Message.deleteMany({
    _id: { $in: messageIds },
    sender: req.user._id,
  });
  if (message.deletedCount === 0) throw "Message not Found";
  return { msg: "Done" };
};

export {
  sendMessageController,
  getAllMessages,
  updateMessage,
  deleteMessage,
  deleteMultipleMessage,
};
