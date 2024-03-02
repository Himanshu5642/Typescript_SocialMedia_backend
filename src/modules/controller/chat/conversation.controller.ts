import { Request } from "express";
import { User, Conversation } from "../../models";
import { msg } from "../../config";
import { Types } from "mongoose";
import { IUser } from "../../interfaces";
import { Socket } from "socket.io";

type singleBody = {
  receiver: string;
};

type groupBody = {
  participants: string[];
  groupName: string;
  groupImage: string | undefined;
};

async function getConvertationsByUserId(userId: string): Promise<string[]> {
  const conv = await Conversation.find({
    participants: {
      $in: [userId],
    },
  });

  return conv.map((c) => c._id.toString());
}

const newConversation = async (req: Request) => {
  const { receiver }: singleBody = req.body;
  if (!receiver) throw msg.idrequired;

  const findUser: IUser | null = await User.findById(receiver);
  if (!findUser) throw msg.userNotFound;

  const conversationExist = await Conversation.findOne({
    chat_type: "single",
    participants: { $all: [req.user._id, new Types.ObjectId(receiver)] },
  });
  if (!conversationExist) {
    const conversation = await Conversation.create({
      createdBy: req.user._id,
      participants: [req.user._id, new Types.ObjectId(receiver)],
    });
    return conversation;
  }
  return conversationExist;
};

const newGroupConversation = async (req: Request) => {
  const { participants, groupName, groupImage }: groupBody = req.body;
  if (participants.length === 0) throw msg.idrequired;

  const findUsers: IUser[] = await User.find({
    _id: { $in: participants },
  });

  if (findUsers.length === participants.length) {
    const existingGroup = await Conversation.findOne({
      chat_type: "group",
      groupName,
      participants: { $all: [req.user._id, ...participants] },
    });
    if (existingGroup) return existingGroup;

    const createGroup = await Conversation.create({
      createdBy: req.user._id,
      chat_type: "group",
      participants: [req.user._id, ...participants],
      groupName,
      groupAdmin: [req.user._id],
      groupImage: groupImage ?? "",
    });
    return createGroup;
  } else throw msg.userNotFound;
};

const getAllConversation = async (req: Request) => {
  const { type } = req.query;
  const conversation = await Conversation.aggregate([
    {
      $match: {
        chat_type: type,
        participants: { $in: [req.user._id] },
      },
    },
    {
      $addFields: {
        receivers: {
          $filter: {
            input: "$participants",
            as: "participant",
            cond: { $ne: [req.user._id, "$$participant"] },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { receivers: "$receivers" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$receivers"],
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
        as: "receivers",
      },
    },
    {
      $project: {
        participants: 0
      }
    },
    {$sort: {updatedAt: -1}}
    
  ]);
  return conversation;
};

export {
  getConvertationsByUserId,
  newConversation,
  newGroupConversation,
  getAllConversation,
};
